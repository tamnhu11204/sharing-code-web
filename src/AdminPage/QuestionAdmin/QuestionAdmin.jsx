import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import QuestionBoxAdmin from '../../components/QuestionBoxAdmin/QuestionBoxAdmin';
import QuestionFilter from '../../components/QuestionFilter/QuestionFilter';
import SortBtnAdmin from '../../components/SortBtnAdmin/SortBtnAdmin';
import * as QuestionService from "../../services/QuestionService";
import * as TagService from "../../services/TagService";
import * as UserService from "../../services/UserService";

const QuestionAdmin = () => {
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

  const [users, setUsers] = useState({});
  const [tags, setTags] = useState({});
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  const getAllQues = async () => {
    const res = await QuestionService.getAllQues();
    return res.data;
  };

  const {
    isLoading: isLoadingQues,
    data: fetchedQuestions,
    error,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: getAllQues,
  });

  const getUserDetails = async (userId) => {
    if (!userId) return null;
    const res = await UserService.getDetailsUser(userId);
    return res.data;
  };

  const getTagDetails = async (tagId) => {
    const res = await TagService.getDetailsTag(tagId);
    return res.data;
  };

  useEffect(() => {
    const fetchUsersAndTags = async () => {
      const userMap = {};
      const tagMap = {};

      if (Array.isArray(fetchedQuestions)) {
        for (let question of fetchedQuestions) {
          if (question.userQues) {
            const user = await getUserDetails(question.userQues);
            userMap[question.userQues] = user;
          }
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
      setQuestions(fetchedQuestions);
    };

    if (fetchedQuestions) {
      fetchUsersAndTags();
    }
  }, [fetchedQuestions]);

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

  const handleQuestionClick = (questionId) => {
    navigate(`/admin/question-detail/${questionId}`);
  };

  return (
    <div className="container">
      <div style={{ color: "#023E73", marginTop: "20px", marginLeft: "20px", height: "auto", paddingRight: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "30px", marginLeft: "20px", marginTop: "20px" }}>
            All Questions
          </h1>
        </div>
        <p style={{ color: "#323538", marginTop: "10px", marginLeft: "20px", fontSize: "20px", fontWeight: "600" }}>
          {questions.length} questions
        </p>
        <br />
        <SortBtnAdmin />
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", width: "100%" }}>
          <QuestionFilter filters={filters} onCheckboxChange={handleCheckboxChange} />
        </div>
        {/* Render các câu hỏi */}
        <div style={{ marginTop: "20px" }}>
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question) => {
              const user = users[question.userQues];
              return (
                <div key={question._id} onClick={() => handleQuestionClick(question._id)}>
                  <QuestionBoxAdmin
                    img={user?.img || ""}
                    username={user?.name || "Unknown"}
                    reputation={user?.reputation || 0}
                    followers={user?.followerCount || 0}
                    title={question.title}
                    tags={question.tags ? question.tags.map(tagId => tags[tagId]?.name || tagId) : []}
                    date={new Date(question.updatedAt).toLocaleString()}
                    views={question.view}
                    answers={question.answerCount}
                    likes={question.upVoteCount}
                  />
                </div>
              );
            })
          ) : (
            <LoadingComponent isLoading={isLoadingQues}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionAdmin;
