export interface FollowUser{
    name: string;
    username: string;
    profile_pic: string;
}

export interface FollowersFollowings{
    followers: FollowUser[];
    following: FollowUser[];
}