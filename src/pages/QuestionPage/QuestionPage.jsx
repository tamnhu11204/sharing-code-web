import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import QuestionBox from "../../components/QuestionBox/QuestionBox";
import QuestionFilter from "../../components/QuestionFilter/QuestionFilter";
import SortBtn from "../../components/SortBtn/SortBtn";
import { setAllSaved } from "../../redux/slides/savedSlide";
import * as QuestionReportService from "../../services/QuestionReportService";
import * as QuestionService from "../../services/QuestionService";
import * as SavedService from "../../services/SavedService";
import * as TagService from "../../services/TagService";
import * as UserService from "../../services/UserService";
import { createSaved } from "../../services/SavedService";
import Pagination from "../../components/Pagination/Pagination";

const QuestionPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [savedList, setSavedList] = useState([]); // Danh sách câu hỏi đã lưu
  const [reportedList, setReportedList] = useState([]); // Quản lý danh sách câu hỏi đã report
  const [questionList, setQuestionList] = useState([]); // Danh sách câu hỏi
  const [likeCounts, setLikeCounts] = useState({}); // Lưu số lượt like của mỗi câu hỏi
  //Phan trang
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10; // Số câu hỏi mỗi trang
  const [totalQuestions, setTotalQuestions] = useState(0);
  // console.log("user", user);
  // Lấy `allSaved` từ Redux state
  const allSaved = useSelector((state) => state.saved.allSaved);

  const navigate = useNavigate();

 
  const [filters, setFilters] = useState({
    no_answers: false,
    no_accepted_answer: false,
    has_bounty: false,
    newest: false,
    recent_activity: false,
    highest_score: false,
    most_frequent: false,
    bounty_ending_soon: false,
    the_following_tags: false,
  });

  //const [userInfo, setUserInfo] = useState({});
  const [users, setUsers] = useState({});
  const [tags, setTags] = useState({});

  // Lấy danh sách câu hỏi từ API, bao gồm các tham số phân trang
  const getAllQuesByActive = async (page, limit) => {
    const res = await QuestionService.getAllQuestionByActive(true, page, limit);
    setTotalQuestions(res.total); // Cập nhật tổng số câu hỏi
    return res.data;
  };
  const {
    isLoading: isLoadingQues,
    data: questions,
    error,
  } = useQuery({
    queryKey: ["questions", currentPage], // Thêm currentPage vào queryKey để phản ánh tham số phân trang
    queryFn: () => getAllQuesByActive(currentPage, questionsPerPage),
  });



  // Lấy thông tin người dùng dựa trên userId từ câu hỏi
  const getUserDetails = async (userId) => {
    if (!userId) return null;
    const res = await UserService.getDetailsUser(userId);
    return res.data;
  };

  // Lấy thông tin tag dựa trên tagId
  const getTagDetails = async (tagId) => {
    const res = await TagService.getDetailsTag(tagId);
    return res.data;
  };

  useEffect(() => {
    const fetchUsersAndTags = async () => {
      const userMap = {};
      const tagMap = {};

      if (Array.isArray(questions)) {
        for (let question of questions) {
          // Lấy thông tin người dùng từ userId
          if (question.userQues) {
            const user = await getUserDetails(question.userQues);
            userMap[question.userQues] = user;
          }

          // Lấy thông tin tag từ tagId
          if (question.tags) {
            for (let tagId of question.tags) {
              if (!tagMap[tagId]) {
                const tag = await getTagDetails(tagId);
                tagMap[tagId] = tag;
              }
            }
          }
        }
      }

      setUsers(userMap);
      setTags(tagMap);
    };

    if (questions) {
      fetchUsersAndTags();
    }
  }, [questions]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("allSaved")) || [];
    setSavedList(savedData.map((item) => item.question));
    dispatch(setAllSaved(savedData));
  }, [dispatch]);

  //hiện câu hỏi đã report
  useEffect(() => {
    // Lấy danh sách các câu hỏi đã được báo cáo từ localStorage
    const reported =
      JSON.parse(localStorage.getItem("reportedQuestions")) || [];
    setReportedList(reported);

    // Nếu `questions` đã được tải từ API, cập nhật trạng thái `isReported`
    setQuestionList((prevQuestions) =>
      prevQuestions.map((q) => ({
        ...q,
        isReported: reported.includes(q._id),
      }))
    );
  }, []);

  if (isLoadingQues) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading questions: {error.message}</div>;
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFilters({
      ...filters,
      [name]: checked,
    });
  };

  const handleAskQuestionClick = () => {
    navigate("/askquestion");
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/question-detail/${questionId}`); // Chuyển hướng đến trang chi tiết câu hỏi
  };

  //xử lí like

  const handleSaved = async (questionId, userQues) => {
    // e.stopPropagation();
    try {
      if (savedList.includes(questionId)) {
        console.log("Question already saved");
        return;
      }

      const savedResponse = await SavedService.createSaved({
        question: questionId,
        user: userQues,
      });

      console.log("Saved response:", savedResponse);

      setSavedList((prev) => [...prev, questionId]);

      // Lưu vào Redux (nếu cần)
      const updatedSavedList = [...allSaved, savedResponse.data]; // allSaved là state hiện tại
      dispatch(setAllSaved(updatedSavedList));
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleUnsave = async (savedId) => {
    try {
      await SavedService.deleteSaved(savedId); // API xóa bài đã lưu

      const updatedSavedList = allSaved.filter(
        (saved) => saved._id !== savedId
      );

      // Cập nhật Redux và localStorage
      dispatch(setAllSaved(updatedSavedList));
      localStorage.setItem("allSaved", JSON.stringify(updatedSavedList));
    } catch (error) {
      console.error("Error unsaving question:", error);
    }
  };

  const handleReport = async (questionId) => {
    try {
      if (!user?.id) {
        console.error("User must be logged in to report questions.");
        return;
      }

      const isConfirmed = window.confirm(
        "Are you sure you want to report this question?"
      );

      if (!isConfirmed) {
        return; // Nếu người dùng nhấn "Cancel", thoát khỏi hàm
      }

      const response = await QuestionReportService.createQuestionReport({
        question: questionId,
        user: user.id, // ID người dùng
      });

      // Lấy danh sách đã báo cáo từ localStorage và cập nhật
      const updatedReported = [...reportedList, questionId];
      localStorage.setItem(
        "reportedQuestions",
        JSON.stringify(updatedReported)
      );

      setReportedList(updatedReported); // Cập nhật danh sách báo cáo trong state
      setQuestionList((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === questionId ? { ...q, isReported: true } : q
        )
      );
      console.log("Report submitted successfully:", response);
      alert(response.message); // Thông báo sau khi báo cáo thành công hoặc lỗi
    } catch (error) {
      console.error("Error reporting question:", error);
      alert("An error occurred while reporting the question.");
    }
  };

  const handleNavToSavedPage = () => {
    navigate("/saved-list");
  };

  // Hàm để thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoadingQues) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading questions: {error.message}</div>;
  }

  return (
    <div className="container">
      <div
        style={{
          color: "#023E73",
          marginTop: "20px",
          marginLeft: "20px",
          height: "auto",
          paddingRight: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "30px",
              marginLeft: "20px",
              marginTop: "20px",
            }}
          >
            All Questions
          </h1>
          <ButtonComponent
            textButton="Ask question"
            onClick={handleAskQuestionClick}
          />
          <ButtonComponent
            textButton="Saved questions"
            onClick={handleNavToSavedPage}
          />
        </div>
        <p
          style={{
            color: "#323538",
            marginTop: "10px",
            marginLeft: "20px",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
         {questions.length} questions
        </p>
        <br />
        <SortBtn />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            width: "100%",
          }}
        >
          <QuestionFilter
            filters={filters}
            onCheckboxChange={handleCheckboxChange}
          />
        </div>
        {/* Render các câu hỏi */}
        <div style={{ marginTop: "20px" }}>
          {isLoadingQues ? (
            <LoadingComponent isLoading={isLoadingQues} />
          ) : Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question) => {
              console.log("question", question);
              console.log("Questions length:", Array.isArray(questions) ? questions.length : "Not an array");

              const user = users[question.userQues]; // Lấy thông tin người dùng từ state
              return (
                <div
                  key={question._id}
                  onClick={() => handleQuestionClick(question._id)}
                >
                  <QuestionBox
                    id={question._id}
                    userQues={question.userQues}
                    img={user?.img || ""}
                    username={user?.name || "Unknown"}
                    reputation={user?.reputation || 0}
                    followers={user?.followerCount || 0}
                    title={question.title}
                    // tags={
                    //   question.tags
                    //     ? question.tags.map(
                    //       (tagId) => tags[tagId]?.name || tagId
                    //     )
                    //     : []
                    // } // Lấy tên tag từ tags map
                    tags={
                      question.tags
                        ? question.tags.map(
                          (tagId) => tags[tagId]?.name || tagId
                        )
                        : []
                    } // Lấy tên tag từ tags map
                    date={new Date(question.updatedAt).toLocaleString()}
                    views={question.view}
                    answers={question.answerCount}
                    likes={question.upVoteCount}
                    isLiked={savedList.includes(question._id)}
                    isSaved={allSaved.some(
                      (saved) => saved.question === question._id
                    )}
                    isReported={reportedList.includes(question._id)}
                    // onLike={(e) =>
                    //   handleSaved(e, question._id, question.userQues)
                    // }
                    onSave={() => handleSaved(question._id, question.userQues)}
                    onUnsave={() => {
                      const savedItem = allSaved.find(
                        (saved) => saved.question === question._id
                      );
                      if (savedItem) handleUnsave(savedItem._id); // Truyền `_id` của bài đã lưu
                    }}
                    onReport={() => handleReport(question._id)}
                  />
                </div>
              );
            })
          ) : (
            <LoadingComponent isLoading={isLoadingQues} />
          )}
        </div>
        {/* Pagination component */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalQuestions / questionsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default QuestionPage;
