export enum PTL_Events {
    PLAYER_MOVE = "PlayerMove",
    PLAYER_JUMP = "PlayerJump",
    LEVEL_START = "LevelStart",
    LEVEL_END = "LevelEnd",
    LEVEL_PAUSE = "LevelPause",
    PLAYER_KILLED = "PlayerKilled",
    SUIT_COLOR_CHANGE = "SuitColorChange",
    PLAYER_ON_PLATFORM = "PlayerOnPlatform",
    SPAWN_PLATFORM = "SpawnPlatform",
    PLAYER_OBTAINED_KEY = "PlayerObtainedKey",
    PLAYER_ENTERED_LEVEL_END = "PlayerEnteredLevelEnd",
    PLAYER_FELL_OUT = "PlayerFellOut"
}

export enum PTL_PlatformType {
    BASIC = "Basic",
    BOUNCY = "Bouncy",
    MOVING = "Moving",
    COLORED = "Colored",
    TRAPDOOR = "TrapDoor",
    DEADLY = "Deadly"
}