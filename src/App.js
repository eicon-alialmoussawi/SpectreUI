import React from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Login from "./login";
import User from "./components/User";
import EditUser from "./components/EditUser";
import EditSocioEconomics from "./components/EditSocioEconomics";
import EditLatestNews from "./components/EditLatestNews";
import EditSystemSettings from "./components/EditSystemSettings";
import EditAward from "./components/EditAward";
import Lookup from "./components/Lookup";
import Role from "./components/Role";
import LatestNews from "./components/LatestNews";
import Awards from "./components/Awards";
import SocioEconomics from "./components/SocioEconomics";
import SystemSettings from "./components/SystemSettings";
import Bands from "./components/Bands";
import MainPage from "./components/MainPage";
import AwardsMenu from "./components/AwardsMenu";
import Pricing from "./components/Pricing";
import Valuations from "./components/Valuations";
import PreviewAwards from "./components/PreviewAwards";
import PrivateRoute from "./routes/PrivateRoute";
import UserRoute from "./routes/UserRoute";
import PublicRoute from "./routes/PublicRoute";
import PackageManagement from "./components/PackageManagement";
import EditPackage from "./components/EditPackage";
import AboutUs from "./components/AboutUs";
import VisualizingReports from "./components/VisualizingReports";
import Welcome from "./components/Welcome";
import ReportSnaps from "./components/ReportSnaps";
import ContactMessages from "./components/ContactMessages";
import CompanyPackages from "./components/CompanyPackages";
import CompanyPackageDetails from "./components/CompanyPackageDetails";
import Pricing2 from "./components/Pricing2";
import Valuations2 from "./components/Valuations2";
import Trends2 from "./components/Trends2";
import Benchmark2 from "./components/Benchmark2";
import SocioEcnomic2 from "./components/SocioEcnomic2";
import Awards2 from "./components/Awards2";
import SpectreFooter from "./components/SpectreFooter";
import Features from "./components/Features";
import FQA from "./components/FQA";
import HelpService from "./components/HelpService";
import Glossary from "./components/Glossary";
import Account from "./components/Account";
import HelpUsing from "./components/HelpUsing";
import SendNotifications from "./components/SendNotifications";
import ValuationsEcharts from "./components/ValuationsEcharts";
import FQAView from "./components/FQAView";
import HelpAboutUs from "./components/HelpAboutUs";
import ExceptionLogs from "./components/ExceptionLogs";
import {
    BrowserRouter,
    Switch,
} from "react-router-dom";
import AwardsMenuTest from "./components/AwardsMenuTest";
import SettingParameters from "./components/SettingParameters";
import MainPageTest from "./components/MainPageTest";
import PricingTest from "./components/PricingTest";
import Trends from "./components/Trends";
import PublicSocioEconomics from "./components/PulblicSocioEconomics";
import CustomerRegistrations from "./components/CustomerRegistrations";
import EditPreRegistration from "./components/EditPreRegistration";
import AdminRoute from "./routes/AdminRoute";
import AdminSocioEconomics from "./components/AdminSocioEconomics";
import Parameters from "./components/Parameters";
import UserNotifications from "./components/UserNotifications";
import Services from "./components/Services";
import Benchmark from "./components/Benchmark";
import Default from "./components/Default";
import GlossaryView from "./components/GlossaryView";
import AboutView from "./components/AboutView";
import GettingStartedView from "./components/GettingStartedView";
import { getLang } from "./utils/common";
import Regions from "./components/Regions";
import EditRegion from "./components/EditRegion";
import LoggedInLogs from "./components/LoggedInLogs";

function App() {
    // window.addEventListener("beforeunload", (ev) => {
        
    //     localStorage.removeItem("Spectre_Token");
    //     localStorage.removeItem("userId");
    //     localStorage.removeItem("userName");
    //     localStorage.removeItem("Spectre_IsAdmin");
    //     // ev.preventDefault();
    //     // return ev.returnValue = 'Are you sure you want to close?';
    // }, []);

    // useEffect(() => {
    //     window.addEventListener("beforeunload", (ev) => 
    //     {  
    //         alert('111')
    //         ev.preventDefault();
    //         return ev.returnValue = 'Are you sure you want to close?';
    //     });
    // }, []);
    return (
        <div class="" dir={getLang() === "ar" ? "rtl" : "ltr"} style={{ direction: getLang() === "ar" ? "rtl" : "ltr" }}>
            <BrowserRouter>
                <div>
                    {/* <Redirect from="/" to="MainPageTest" /> */}

                    <div className="content">
                        <Switch>
                            <PublicRoute exact path="/" component={MainPageTest} />
                            <PublicRoute exact path="/login" component={Login} />
                            {/* <Route path="/PreRegistration" component={PreRegistration} /> */}
                            <UserRoute exact path="/MainPage" component={MainPage} />{" "}
                            <UserRoute exact path="/AwardsMenu" component={AwardsMenu} />
                            <UserRoute exact path="/Valuations" component={Valuations} />
                            <UserRoute exact path="/ValuationsEcharts" component={ValuationsEcharts} />
                            <UserRoute exact path="/AwardsMenuTest" component={AwardsMenuTest} />
                            <UserRoute exact path="/Pricing" component={Pricing} />
                            <UserRoute exact path="/PricingTest" component={PricingTest} />
                            <UserRoute exact path="/Benchmark" component={Benchmark} />
                            <UserRoute exact path="/Default" component={Default} />
                            <UserRoute
                                exact path="/PublicSocioEconomics"
                                component={PublicSocioEconomics}
                            />
                            <PrivateRoute
                                exact path="/SettingParameters"
                                component={SettingParameters}
                            />

                            <UserRoute exact path="/Account" component={Account} />

                            <UserRoute exact path="/Trends" component={Trends} />
                            <UserRoute exact path="/PreviewAwards" component={PreviewAwards} />

                            <UserRoute exact path="/Valuations2" component={Valuations2} />
                            <UserRoute exact path="/Pricing2" component={Pricing2} />
                            <UserRoute exact path="/SocioEcnomic2" component={SocioEcnomic2} />
                            <UserRoute exact path="/Benchmark2" component={Benchmark2} />
                            <UserRoute exact path="/Awards2" component={Awards2} />
                            <UserRoute exact path="/Trends2" component={Trends2} />
                            <UserRoute exact path="/GlossaryView" component={GlossaryView} />
                            <UserRoute exact path="/AboutView" component={AboutView} />
                            <UserRoute exact path="/GettingStartedView/:id" component={GettingStartedView} />

                            <UserRoute exact path="/FQAView" component={FQAView} />
                            <AdminRoute exact path="/User" component={User} />
                            <AdminRoute exact path="/EditUser/:id" component={EditUser} />
                            <AdminRoute
                                exact
                                path="/EditSocioEconomics/:id"
                                component={EditSocioEconomics}
                            />{" "}
                            <AdminRoute exact path="/EditAward/:id" component={EditAward} />
                            <AdminRoute exact path="/ExceptionLogs" component={ExceptionLogs} />
                            <AdminRoute
                                exact
                                path="/EditLatestNews/:id"
                                component={EditLatestNews}
                            />{" "}
                            <AdminRoute exact path="/EditAward/:id" component={EditAward} />
                            <AdminRoute exact path="/EditRegion/:id" component={EditRegion} />
                            <AdminRoute
                                exact
                                path="/EditSystemSettings/:id"
                                component={EditSystemSettings}
                            />
                            <AdminRoute exact path="/SendNotifications" component={SendNotifications} />
                            <AdminRoute exact path="/HelpAboutUs" component={HelpAboutUs} />
                            <AdminRoute exact path="/Lookup" component={Lookup} />
                            <AdminRoute exact path="/Role" component={Role} />
                            <AdminRoute exact path="/Dashboard" component={Dashboard} />
                            <AdminRoute exact path="/Bands" component={Bands} />
                            <AdminRoute exact path="/LatestNews" component={LatestNews} />
                            <AdminRoute exact path="/Awards" component={Awards} />
                            <AdminRoute exact path="/Regions" component={Regions} />
                            <AdminRoute exact path="/LoggedInLogs" component={LoggedInLogs} />
                            <AdminRoute exact path="/AdminSocioEconomics" component={AdminSocioEconomics} />
                            <AdminRoute
                                exact
                                path="/HelpUsing"
                                component={HelpUsing}
                            />

                            <AdminRoute exact path="/Glossary" component={Glossary} />
                            <AdminRoute exact path="/HelpService" component={HelpService} />
                            <AdminRoute exact path="/FQA" component={FQA} />

                            <PrivateRoute
                                exact
                                path="/SystemSettings"
                                component={SystemSettings}
                            />
                            <AdminRoute
                                exact
                                path="/SocioEconomics"
                                component={SocioEconomics}
                            />
                            <AdminRoute
                                exact
                                path="/PackageManagement"
                                component={PackageManagement}
                            />
                            <AdminRoute
                                exact path="/EditPackage/:id"
                                component={EditPackage}
                            />
                            <AdminRoute
                                exact path="/CustomerRegistrations"
                                component={CustomerRegistrations}
                            />
                            <AdminRoute
                                exact path="/EditPreRegistration/:id"
                                component={EditPreRegistration}
                            />

                            <AdminRoute
                                exact path="/Parameters"
                                component={Parameters}
                            />
                            <AdminRoute exact path="/UserNotifications" component={UserNotifications} />

                            <AdminRoute
                                exact path="/AboutUs"
                                component={AboutUs}
                            />
                            <AdminRoute
                                exact path="/Features"
                                component={Features}
                            />
                            <AdminRoute
                                exact path="/Services"
                                component={Services}
                            />
                            <AdminRoute
                                exact path="/VisualizingReports"
                                component={VisualizingReports}
                            />
                            <AdminRoute
                                exact path="/Welcome"
                                component={Welcome}
                            />
                            <AdminRoute
                                exact path="/ReportSnaps"
                                component={ReportSnaps}
                            />
                            <AdminRoute
                                exact path="/ContactMessages"
                                component={ContactMessages}
                            />
                            <AdminRoute
                                exact path="/CompanyPackages"
                                component={CompanyPackages}
                            />
                            <AdminRoute
                                exact path="/CompanyPackageDetails/:id"
                                component={CompanyPackageDetails}
                            />
                            <AdminRoute
                                exact
                                path="/Footer"
                                component={SpectreFooter}
                            />

                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
