import HomePage from "../pages/HomePage/HomePage";
import QuestionPage from "../pages/QuestionPage/QuestionPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import LogInPage from "../pages/LogInPage/LogInPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import TagsPage from "../pages/TagsPage/TagsPage";
import TagsDetailPage from "../pages/TagsDetailPage/TagsDetailPage";
import OtherUserProfilePage from "../pages/OtherUserProfilePage/OtherUserProfilePage";
import StatisticPage from "../pages/StatisticPage/StatisticPage";
import StatisticQuestionPage from "../pages/StatisticPage/StatisticQuestionPage";
import StatisticUserPage from "../pages/StatisticPage/StatisticUserPage";
import StatisticTopicPage from "../pages/StatisticPage/StatisticTopicPage";
import StatisticActivityPage from "../pages/StatisticPage/StatisticActivityPage";
import AskQuestionPage from "../pages/AskQuestionPage/AskQuestionPage";
import ProfileAdmin from "../AdminPage/ProfileAdmin/Profile_Admin";
import QuestionAdmin from "../AdminPage/QuestionAdmin/QuestionAdmin";
import UsersAdmin from "../AdminPage/UsersAdmin/UsersAdmin";
import QuestionDetailPage from "../pages/QuestionDetailPage/QuestionDetailPage";
import QuestionDetailAdmin from "../AdminPage/QuestionDetailAdmin/QuestionDetailAdmin";
import TagAdmin from "../AdminPage/TagAdmin/TagAdmin";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },

  {
    path: "/signup",
    page: SignUpPage,
    isShowHeader: true,
  },

  {
    path: "/login",
    page: LogInPage,
    isShowHeader: true,
  },

  {
    path: "/profile",
    page: ProfilePage,
    isShowHeader: true,
  },

  {
    path: "/question",
    page: QuestionPage,
    isShowHeader: true,
  },

  {
    path: "/tag",
    page: TagsPage,
    isShowHeader: true,
  },

  {
    path: "/statistic",
    page: StatisticPage,
    isShowHeader: true,
  },

  {
    path: "/statistic/question",
    page: StatisticQuestionPage,
    isShowHeader: true,
  },

  {
    path: "/statistic/user",
    page: StatisticUserPage,
    isShowHeader: true,
  },

  {
    path: "/statistic/topic",
    page: StatisticTopicPage,
    isShowHeader: true,
  },

  {
    path: "/statistic/activity",
    page: StatisticActivityPage,
    isShowHeader: true,
  },

  {
    path: "*",
    page: NotFoundPage,
  },

  {
    path: "/tagsdetail",
    page: TagsDetailPage,
    isShowHeader: true,
  },

  {
    path: "/otheruserprofile",
    page: OtherUserProfilePage,
    isShowHeader: true,
  },
  {
    path: "/askquestion",
    page: AskQuestionPage,
    isShowHeader: true,
  },

  {
    path: "admin/profile",
    page: ProfileAdmin,
    isShowHeader: true,
  },

  {
    path: "admin/question",
    page: QuestionAdmin,
    isShowHeader: true,
  },

  {
    path: "admin/user",
    page: UsersAdmin,
    isShowHeader: true,
  },

  {
    path: "/question-detail/:questionId",
    page: QuestionDetailPage,
    isShowHeader: true,
  },

  {
    path: "/admin/questiondetail",
    page: QuestionDetailAdmin,
    isShowHeader: true,
  },
  {
    path: "/admin/tag",
    page: TagAdmin,
    isShowHeader: true,
  },
];
