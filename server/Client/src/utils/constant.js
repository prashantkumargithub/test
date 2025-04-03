export const HOST = import.meta.env.VITE_HOST_URL;
//auth route
export const AUTH_ROUTES = "/api/v1/auth";
export const SINGUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`;
export const GOOGLE_AUTH_ROUTES = `${AUTH_ROUTES}/googleAuth`;
export const SENDOTP_ROUTES = `${AUTH_ROUTES}/sendOTP`;
export const VERIFYOTP_ROUTES = `${AUTH_ROUTES}/verifyOTP`;
export const SENDOTP_FORGETPASSWORD_ROUTES = `${AUTH_ROUTES}/ForgetPasswordOTP`;
export const SENDLINK_FORGETPASSWORD_ROUTES = `${AUTH_ROUTES}/ResetPasswordLink`;
export const RESETPASSWORD_ROUTES = `${AUTH_ROUTES}/ResetPassword`;

//user routes
export const USER_ROUTES = "/api/v1/User";
export const getUserData_ROUTES = `${USER_ROUTES}/User`;
export const PROFILESETUP_ROUTES = `${USER_ROUTES}/ProfileSetup`;
export const Add_PROFILE_IMAGE_ROUTE = `${USER_ROUTES}/AddProfileImage`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${USER_ROUTES}/RemoveProfileImage`;
export const Add_PROFILE_COLOR_ROUTE = `${USER_ROUTES}/AddProfileColor`;
export const USER_DATA_ROUTE = `${USER_ROUTES}/UserData`;
export const HELP_FORM_ROUTES = `${USER_ROUTES}/HelpForm`;
export const LOGIN_ALERT_ROUTE = `${USER_ROUTES}/LoginAlert`;
export const CHANGE_PASSWORD_ROUTE = `${USER_ROUTES}/ChangePassword`;
export const SENDOTP_CHANGE_EMAIL_ROUTES = `${USER_ROUTES}/sendOtpEmailchange`;
export const UPDATE_EMAIL_ROUTE = `${USER_ROUTES}/UpdateEmail`;


//Contact routes
export const CONTACTS_ROUTES = "/api/v1/Contacts";
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`;
export const GET_USER_LIST_DM_ROUTES = `${CONTACTS_ROUTES}/getUserListForDM`;

//Public routes
export const IMAGE_ROUTES = `/image/:folder/:filename`;
export const FILE_ROUTES = `/file/:folder/:filename`;

//Message routes
export const MESSAGE_ROUTES = "/api/v1/message";
export const GET_MESSAGE_ROUTES = `${MESSAGE_ROUTES}/getMessage`;
export const UPLOAD_FILE_ROUTES = `${MESSAGE_ROUTES}/UploadMsgFile`;
export const DELETE_MESSAGE_ROUTES = `${MESSAGE_ROUTES}/delMessage`;
export const DELETE_CHAT_ROUTES = `${MESSAGE_ROUTES}/deleteChat`;
export const BLOCKED_USER_ROUTES = `${MESSAGE_ROUTES}/blockUser`;
export const UNBLOCKED_USER_ROUTES = `${MESSAGE_ROUTES}/unblockUser`;
export const DELETE_ALL_CHATS_ROUTE = `${MESSAGE_ROUTES}/DeleteAllChat`;
