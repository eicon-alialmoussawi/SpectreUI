import http from "./httpCommon";
import { getLang } from "./common";

const getAll = () => {
  return http.get("/User/GetAllExistingUsers");
};

const getPermissions = () => {
  return http.get("/Permission/GetAll");
};
const GetMenuPermissions = () => {
  return http.get("/Permission/GetMenuPermissions");
};

const getUserPermissions = (PageUrl) => {
  return http.get(`/Permission/GetUserPermissions?PageUrl=${PageUrl}`);
};

const getAllAwards = () => {
  return http.get("/Award/GetAllForView");
};
const getRegions = () => {
  return http.get("/Region/GetRegions");
};
const getLoginDetails = (date, userId) => {
  var queryString = "";
  if(date) {
    queryString += `?date=${date}`;
  }
  if(date && userId) {
    queryString += `&UserId=${userId}`;
  } else {
    if(userId) {
      queryString += `?UserId=${userId}`;
    }
  }
  return http.get(`/Login/GetLoginDetails${queryString}`);
};
const getAllSocioEconomics = () => {
  return http.get("/SocioEconomic/GetAll");
};
const getAllSocioEconomicsForView = () => {
  return http.get("/SocioEconomic/GetAllForView");
};

const getAllSystemSettings = () => {
  return http.get("/SystemSettings/GetAll");
};

const getLatestNews = () => {
  return http.get("/LatestNews/GetAll");
};

const getSystemSettingById = (id) => {
  return http.get(`/SystemSettings/GetById?Id=${id}`);
};
const GetByCountryAndYear = (countryId, Year, ISIMF) => {
  return http.get(
    `/SocioEconomic/GetByCountryAndYear?CountryId=${countryId}&Year=${Year}&ISIMF=${ISIMF}`
  );
};

const getAllBands = () => {
  return http.get("/Bands/GetAll");
};
const getBandById = (id) => {
  return http.get(`/Bands/GetById?Id=${id}`);
};
const getUserById = (id) => {
  return http.get(`/User/GetById?Id=${id}`);
};

const CheckIfUserIsAdmin = () => {
  return http.get(`/User/CheckIfUserIsAdmin`);
};
const getLatesNewsById = (id) => {
  return http.get(`/LatestNews/GetById?Id=${id}`);
};

const getSocioEconomicById = (id) => {
  return http.get(`/SocioEconomic/GetById?Id=${id}`);
};
const getAwardById = (id) => {
  return http.get(`/Award/GetById?Id=${id}`);
};
const getRegionById = (id) => {
  return http.get(`/Region/GetById?Id=${id}`);
};
const removeRegion = (id) => {
  return http.post(`/Region/Delete?Id=${id}`);
}

const getLookupById = (id) => {
  return http.get(`/Lookup/GetById?Id=${id}`);
};

const GetLookupsByParentId = (id) => {
  return http.get(`/Lookup/GetLookupsByParantCode?Code=${id}`);
};

const getFilterSocioEconomics = (countryIds, sourceId) => {
  return http.get(
    `/SocioEconomic/FilterSocioEconimcs?CountryIds=${countryIds}&SourceId=${sourceId}`
  );
};

const getFilterSocioEconomicsByCountry = (countryId, IsIMF) => {
  return http.get(
    `/SocioEconomic/FilterSocioEconimcsByCountryId?CountryId=${countryId}&IsIMF=${IsIMF}`
  );
};

const create = (data) => {
  return http.post("/tutorials", data);
};
const createBand = (data) => {
  return http.post("/Bands/Create", data);
};

const createRole = (data) => {
  return http.post("/Role/create", data);
};

const update = (id, data) => {
  return http.post("/User/Create", data);
};
const filterAwards = (data) => {
  return http.post("/Award/Filter", data);
};
const FilterPricing = (data) => {
  return http.post("/Award/FilterPricing", data);
};
const FilterTrends = (data) => {
  return http.post("/Award/FilterTrends", data);
};

const saveSocioEconomic = (id, data) => {
  return http.post("/SocioEconomic/Create", data);
};
const saveSystemSettings = (id, data) => {
  return http.post("/SystemSettings/Create", data);
};
const saveLatestNews = (id, data) => {
  return http.post("/LatestNews/Create", data);
};

const saveAward = (id, data) => {
  return http.post("/Award/Create", data);
};
const saveRegion = (id, data) => {
  return http.post("/Region/Create", data);
};
const updateRegion = (id, data) => {
  return http.post("/Region/Update", data);
}
const importCountries = (data) => {
  return http.post("/Country/Import", data);
};
const importSocioEconomics = (data) => {
  return http.post("/SocioEconomic/Import", data);
};
const importAwards = (data) => {
  return http.post("/Award/ImportAwards", data);
};
const addFilter = (data) => {
  return http.post("/TemplateFilter/AddListFilterDetails", data);
};
const addFilterPricing = (data) => {
  return http.post("/TemplateFilter/addFilterPricing", data);
};
const FilterValuations = (data) => {
  return http.post("/Award/FilterValuations", data);
};

const login = (data) => {
  return http.post("/Login/ValidateLogin", data);
};
const saveLookup = (data) => {
  return http.post("/Lookup/Create", data);
};

const remove = (id) => {
  return http.post(`/User/Delete?Id=${id}`);
};
const removeSocioEconomic = (id) => {
  return http.post(`/SocioEconomic/Delete?Id=${id}`);
};

const deleteRole = (id) => {
  return http.post(`/Role/Delete?RoleId=${id}`);
};

const deleteBand = (id) => {
  return http.post(`/Bands/DeleteBandById?Id=${id}`);
};

const deleteLatestNews = (id) => {
  return http.post(`/LatestNews/Delete?Id=${id}`);
};
const removeAward = (id) => {
  return http.post(`/Award/Delete?Id=${id}`);
};

const removeAll = () => {
  return http.post(`/tutorials`);
};

const findByTitle = (title) => {
  return http.get(`/User?UserName=${title}`);
};
const getAllLookups = (id) => {
  return http.get("/Lookup/GetAll");
};
const getAllRoles = () => {
  return http.get("/Role/GetAll");
};
const getAllCountries = () => {
  return http.get("/Country/GetAll");
};

const getAllFilters = (Page) => {
  return http.get(`/TemplateFilter/GetAllByPage?Page=${Page}`);
};

const getRoleById = (id) => {
  return http.get(`/Role/GetById?RoleId=${id}`);
};
const GetDetailsByFilterId = (id) => {
  return http.get(`/TemplateFilter/GetDetailsByFilterId?Id=${id}`);
};

const getAllPackages = () => {
  return http.get("/Package/GetAll");
};
const checkTokenValditiy = (token) => {
  return http.get(`/Login/CheckTokeValidity?Token=${token}`);
};

const getPackageById = (id) => {
  return http.get(`/Package/GetById?Id=${id}`);
};

const deletePackage = (id) => {
  return http.post(`/Package/DeletePackage?Id=${id}`);
};

const uploadMedia = (data) => {
  return http.post("/Utility/UploadFile", data);
};

const savePackage = (data) => {
  return http.post("/Package/SavePackage", data);
};

const getPages = () => {
  return http.get("/Pages/GetAll");
};

const getPublicPackages = () => {
  return http.get("/Public/GetAllPackages");
};

const savePreRegistration = (data) => {
  return http.post("/Public/SendRegistration", data);
};

const getAllPreRegistrations = () => {
  return http.get("/CompanyPreRegistration/GetAll");
};

const getPreRegistrationWithDetails = () => {
  return http.get("/CompanyPreRegistration/GetWithDetails");
};

const getAllIcons = () => {
  return http.get("/Icon/GetAll");
};

const setPreRegistrationAdViewed = (id) => {
  return http.post(`/CompanyPreRegistration/SetAsViewed?Id=${id}`);
};

const deletePreRegistration = (id) => {
  return http.post(`/CompanyPreRegistration/Delete?Id=${id}`);
};

const getPreRegistrationDetailsWithId = (id) => {
  return http.get(`/CompanyPreRegistration/GetDetailsWithId?Id=${id}`);
};

const getPackagePermissionsById = (id) => {
  return http.get(`/Package/GetPackagePermissions?Id=${id}`);
};

const saveCompanyPackage = (data) => {
  return http.post("/CompanyPackages/SaveCompanyPackage", data);
};

const getAllParameters = () => {
  return http.get("/Params/GetAll");
};

const updateParams = (id, value) => {
  return http.post(`/Params/Update?ParamId=${id}&Value=${value}`);
};

const getUserNotifications = (Status) => {
  return http.get(`/Notifications/GetAll?Status=${Status}`);
};

const setNotificationAsViewed = (id) => {
  return http.post(`/Notifications/SetAsViewed?Id=${id}`);
};

const getAboutUs = () => {
  return http.get("/HomePage/GetAboutUs");
};

const updateAbout = (data) => {
  return http.post("/HomePage/UpdateAbout", data);
};

const publicGetWelcome = () => {
  return http.get("/Public/GetWelcome");
};

const getServices = () => {
  return http.get("/HomePage/GetServices");
};

const updateService = (data) => {
  return http.post("/HomePage/UpdatedServices", data);
};

const getHomePageContent = () => {
  return http.get("/Public/GetHomePageContect");
};

const getVisualizing = () => {
  return http.get("/HomePage/GetVisualizing");
};

const updateVisualizing = (data) => {
  return http.post("/HomePage/UpdateVisualizing", data);
};

const getWelcome = () => {
  return http.get("/HomePage/GetWelcome");
};

const updateWelcome = (data) => {
  return http.post("/HomePage/UpdateWelcome", data);
};

const getReportSnaps = () => {
  return http.get("/HomePage/GetReportSnaps");
};

const updateReportSnaps = (data) => {
  return http.post("/HomePage/UpdateSnaps", data);
};

const deleteReportSnaps = (id) => {
  return http.post(`/HomePage/DeleteSnap?Id=${id}`);
};

const saveReportSnap = (data) => {
  return http.post("/HomePage/SaveSnap", data);
};

const saveContactUs = (data) => {
  return http.post("/Public/SaveContactUs", data);
};

const getContactUs = () => {
  return http.get("/ContactUs/GetAll");
};

const deleteContactUs = (id) => {
  return http.post(`/ContactUs/Delete?Id=${id}`);
};

const getClientMenu = () => {
  return http.get("/User/GetClientMenu");
};

const sendReply = (data) => {
  return http.post("/ContactUs/SendReply", data);
};

const getCompanyPackageWithDetails = () => {
  return http.get("/CompanyPackages/GetAll");
};

const checkIfCanView = (PageUrl) => {
  return http.get(`/Permission/CheckIfUserCanView?PageUrl=${PageUrl}`);
};

const getCompanyPackageById = (id) => {
  return http.get(`/CompanyPackages/GetById?Id=${id}`);
};

const changePassword = (Username, NewPassword) => {
  return http.post(
    `/User/ChangePassword?Username=${Username}&NewPassword=${NewPassword}`
  );
};

const updateCompanyPackage = (data) => {
  return http.post("/CompanyPackages/UpdateCompanyPackage", data);
};

const getUserCountries = (PageUrl) => {
  return http.get(`/Country/GetUserCountries?PageUrl=${PageUrl}&Lang=${getLang}`);
};

const getUserCountriesWithSource = (PageUrl, Source) => {
  return http.get(`/Country/GetUserCountries?PageUrl=${PageUrl}&Source=${Source}&Lang=${getLang}`);
};

const updateFooter = (data) => {
  return http.post("/HomePage/UpdateFooter", data);
};

const getFooter = (data) => {
  return http.get("/HomePage/GetFooter");
};

const getPublicFooter = () => {
  return http.get("/Public/GetFooter");
};


const saveBands = (data) => {
  return http.post("/Bands/SaveBand", data);
};

const removeAllBands = (id) => {
  return http.post("/Bands/RemoveAllBands");
};

const getFilterAwards = (data) => {
  return http.post("/Award/GetFilterAwards", data);
};

const removeAllAwards = () => {
  return http.post("/Award/RemoveAllAwards");
};

const deleteUsers = (id) => {
  return http.post(`/User/DeleteUsers?Id=${id}`);
};

const getStatistics = () => {
  return http.get("/Statistics/GetStatistics");
};

const getForBarChart = () => {
  return http.get("/Statistics/getForBarChart");
};

const getAllExceptClient = () => {
  return http.get("/Role/GetAllExceptClient");
};

const deleteAllSocioEcnomic = (id) => {
  return http.post("/SocioEconomic/DeleteAllSocioEcnomic");
};

const saveUserFilters = (data) => {
  return http.post("/UserFilters/SaveUserFilter", data);
};

const getExpiredCompanyPackages = () => {
  return http.get("/CompanyPackages/GetExpiredCompanyPackages");
};


const getUserFilters = (PageUrl) => {
  return http.get(`/UserFilters/GetUserFilters?PageUrl=${PageUrl}`);
};

const getDistancingResult = (data) => {
  return http.post("/Award/GetDistancingResult", data);
};

const getBenchmarkResult = (data) => {
  return http.post("/Award/BenchmarkFiltering", data);
};

const filterSocioEconimcsByYear = (Year, IsIMF) => {
  return http.get(`/SocioEconomic/FilterSocioEconimcsByYear?Year=${Year}&IsIMF=${IsIMF}`);
};

const getBenchmarkByRatio = (data) => {
  return http.post("/Award/BenchmarkByRatio", data);
};

const getAllFeatures = () => {
  return http.get("/Features/GetAll");
};

const deleteFeature = (Id) => {
  return http.post(`/Features/Delete?Id=${Id}`);
};

const saveFeature = (data) => {
  return http.post("/Features/Save", data);
};


const getAllGlossary = () => {
  return http.get("/Glossary/GetAll");
};

const deleteGlossary = (Id) => {
  return http.post(`/Glossary/Delete?Id=${Id}`);
};

const saveGlossary = (data) => {
  return http.post("/Glossary/Save", data);
};


const getAllFQA = () => {
  return http.get("/FQA/GetAll");
};

const deleteFQA = (Id) => {
  return http.post(`/FQA/Delete?Id=${Id}`);
};

const saveFQA = (data) => {
  return http.post("/FQA/Save", data);
};

const getAllHelpServices = () => {
  return http.get("/HelpService/GetAll");
};

const saveHelpServices = (data) => {
  return http.post("/HelpService/Save", data);
};


const getAllHelpUsing = () => {
  return http.get("/HelpUsing/GetAll");
};

const deleteHelpUsing = (Id) => {
  return http.post(`/HelpUsing/Delete?Id=${Id}`);
};

const saveHelpUsing = (data) => {
  return http.post("/HelpUsing/Save", data);
};

const sendNotification = (TextEn, TextAr, TextFr) => {
  return http.post(`/Notifications/SendNotification?TextEn=${TextEn}&TextAr=${TextAr}&TextFr=${TextFr}`);
};


const recalculateValuation = (data) => {
  return http.post("/Award/RecalculateValuation", data);
};

const getUserInfo = () => {
  return http.get("/User/GetUserInfo");
};

const getUserFeatures = (Lang) => {
  return http.get(`/User/GetUserFeatures?Lang=${Lang}`);
};

const getDefault = () => {
  return http.get("/UserFilters/GetDefault");
};

const getHelpAbout = () => {
  return http.get("/HomePage/GetHelpAboutUs");
};

const updateHelpAbout = (data) => {
  return http.post("/HomePage/UpdateHelpAbout", data);
};

const setUserNotificationAsSeen = () => {
  return http.post("/Notifications/SetUserNotificationAsSeen");
};

const getUnSeenNotifications = () => {
  return http.get("/Notifications/GetUnSeenNotifications");
};

const getExceptionLogs = () => {
  return http.get("/Logs/GetExceptions");
};


const APIFunctions = {
  getExceptionLogs,
  setUserNotificationAsSeen,
  getUnSeenNotifications,
  getHelpAbout,
  updateHelpAbout,
  getUserCountriesWithSource,
  getDefault,
  getUserInfo,
  getUserFeatures,
  recalculateValuation,
  sendNotification,
  getAllHelpUsing, 
  deleteHelpUsing, 
  saveHelpUsing,
  getAllHelpServices,
  saveHelpServices,
  getAllFQA, 
  deleteFQA, 
  saveFQA,
  getAllGlossary, 
  deleteGlossary, 
  saveGlossary,
  saveFeature,
  deleteFeature,
  getAllFeatures,
  getBenchmarkByRatio,
  filterSocioEconimcsByYear,
  getBenchmarkResult,
  getDistancingResult,
  getUserFilters,
  getExpiredCompanyPackages,
  saveUserFilters,
  deleteAllSocioEcnomic,
  getAllExceptClient,
  getForBarChart,
  getStatistics,
  deleteUsers,
  removeAllAwards,
  getFilterAwards,
  removeAllBands,
  getPublicFooter,
  getFooter,
  updateFooter,
  getReportSnaps,
  updateReportSnaps,
  deleteReportSnaps,
  saveReportSnap,
  getAll,
  getUserById,
  create,
  update,
  remove,
  removeAll,
  removeAward,
  GetMenuPermissions,
  findByTitle,
  getAllLookups,
  getAllRoles,
  getPermissions,
  getRoleById,
  getAllAwards,
  getAllSocioEconomics,
  getLatestNews,
  getAllSocioEconomicsForView,
  getFilterSocioEconomics,
  getFilterSocioEconomicsByCountry,
  createRole,
  createBand,
  deleteRole,
  deleteBand,
  getAllCountries,
  getSocioEconomicById,
  getAwardById,
  GetLookupsByParentId,
  saveSocioEconomic,
  saveLatestNews,
  saveAward,
  removeSocioEconomic,
  importSocioEconomics,
  importAwards,
  getLookupById,
  deleteLatestNews,
  getLatesNewsById,
  getAllSystemSettings,
  getSystemSettingById,
  getAllBands,
  getBandById,
  CheckIfUserIsAdmin,
  filterAwards,
  importCountries,
  getAllFilters,
  GetDetailsByFilterId,
  addFilter,
  FilterPricing,
  FilterTrends,
  addFilterPricing,
  login,
  saveLookup,
  getAllPackages,
  checkTokenValditiy,
  getPackageById,
  uploadMedia,
  deletePackage,
  savePackage,
  getPages,
  getUserPermissions,
  getPublicPackages,
  savePreRegistration,
  getAllIcons,
  getAllPreRegistrations,
  getPreRegistrationWithDetails,
  setPreRegistrationAdViewed,
  deletePreRegistration,
  getPreRegistrationDetailsWithId,
  getPackagePermissionsById,
  saveCompanyPackage,
  getAllParameters,
  updateParams,
  getUserNotifications,
  setNotificationAsViewed,
  GetByCountryAndYear,
  getAboutUs,
  updateAbout,
  publicGetWelcome,
  getServices,
  updateService,
  getHomePageContent,
  getVisualizing,
  updateVisualizing,
  getWelcome,
  updateWelcome,
  getServices,
  updateService,
  FilterValuations,
  saveContactUs,
  getContactUs,
  deleteContactUs,
  getClientMenu,
  sendReply,
  getCompanyPackageWithDetails,
  checkIfCanView,
  getCompanyPackageById,
  changePassword,
  updateCompanyPackage,
  getUserCountries,
  saveBands,
  getRegions,
  getRegionById,
  saveRegion,
  updateRegion,
  getLoginDetails,
  removeRegion
};

export default APIFunctions;
