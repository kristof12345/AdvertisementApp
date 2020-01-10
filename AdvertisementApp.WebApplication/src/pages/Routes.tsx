import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//Pages
import MenuBar from "../components/Common/MenuBar/MenuBar";
import HomePage from "./HomePage";
import AdvertisementsPage from "./AdvertisementsPage";
import MyAdvertisementsPage from "./MyAdvertisementsPage";
import UserSettingsPage from "./UserSettingsPage";
import CreateAdvertisementPage from "./CreateAdvertisementPage";
import MyAdvertisementDetailPage from "./MyAdvertisementDetailPage";
import AdvertisementDetailPage from "./AdvertisementDetailPage";
import SubscriptionPage from "./SubscriptionPage";
import EditAdvertisementPage from "./EditAdvertisementPage";
import AdminPage from "./AdminPage";

const Routes: React.SFC = () => {
  return (
    <Router>
      <header>
        <Route path="/" component={MenuBar} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/advertisements" component={AdvertisementsPage} />
        <Route exact path="/myadvertisements" component={MyAdvertisementsPage} />
        <Route path="/createadvertisement" component={CreateAdvertisementPage} />
        <Route path="/settings" component={UserSettingsPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/subscription" component={SubscriptionPage} />
        <Route path="/advertisements/:id" component={AdvertisementDetailPage} />
        <Route exact path="/myadvertisements/:id" component={MyAdvertisementDetailPage} />
        <Route path="/myadvertisements/:id/edit" component={EditAdvertisementPage} />
      </header>
    </Router>
  );
};
export default Routes;
