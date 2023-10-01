export interface MiniUser{
    name: string;
    username: string;
    profile_pic: string;
}

export interface FollowersFollowings{
    followers: MiniUser[];
    following: MiniUser[];
}

export interface FollowReturn{
    do: string;
    user: MiniUser;
}