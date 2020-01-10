import User from "./User";

export enum UserStatus{
    Enabled,
    Disabled
}

class DetailedUser extends User {
    subscriptionName: string = "";
    status: UserStatus = UserStatus.Enabled;
}

export default DetailedUser;