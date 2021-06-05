CREATE DATABASE sakura;

CREATE TABLE Guilds (
    guildId VARCHAR(100) NOT NULL,
    guildName VARCHAR(100) NOT NULL,
    ownerID VARCHAR(300) NOT NULL,
    ownerName VARCHAR(300) NOT NULL,
    region VARCHAR(300) NOT NULL,
    memberCount BIGINT(255) NOT NULL,
    createdAt DATE NOT NULL,
    UNIQUE KEY(guildId)
);

CREATE TABLE reactionRoles (
    guildId VARCHAR(100) NOT NULL,
    messageID VARCHAR(100) NOT NULL,
    emoji VARCHAR(100) NOT NULL,
    roleID VARCHAR(100) NOT NULL,
    UNIQUE KEY(guildId)
);

CREATE TABLE Suggs (
    noSugg VARCHAR(255) NOT NULL,
    Author VARCHAR(300) NOT NULL,
    Avatar VARCHAR(2048) NOT NULL,
    Message mediumtext NOT NULL,
    Moderator VARCHAR(300) NOT NULL,
    LAST_EDITED TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    stat VARCHAR(2048) NOT NULL "Needs votes!"
);

CREATE TABLE Challenges (
    guildId VARCHAR(100) NOT NULL,
    player VARCHAR(300) NOT NULL PRIMARY KEY
);

CREATE TABLE Points (
    guildId VARCHAR(100) NOT NULL,
    user VARCHAR(300) NOT NULL,
    xpLogId VARCHAR(100) NOT NULL,
    nextLevel INT(255) NOT NULL DEFAULT '0',
    currentPoints INT(255) NOT NULL DEFAULT '0',
    remainingPoints INT(255) NOT NULL DEFAULT '100',
    UNIQUE KEY(guildId, user)
);

CREATE TABLE Challenge (
    guildId VARCHAR(100) NOT NULL,
    msgId VARCHAR(255) NOT NULL PRIMARY KEY,
    channelD VARCHAR(255) NOT NULL,
    moderator VARCHAR(300) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description mediumtext NOT NULL,
    challengeNo VARCHAR(255) NOT NULL,
    prize1 VARCHAR(1000) NOT NULL,
    prize2 VARCHAR(1000) NOT NULL,
    prize3 VARCHAR(1000) NOT NULL
);

CREATE TABLE Submissions (
    guildId VARCHAR(100) NOT NULL,
    msgId VARCHAR(1000) NOT NULL PRIMARY KEY,
    author VARCHAR(300) NOT NULL,
    message mediumtext NOT NULL,
    challengeNo VARCHAR(255),
    moderator VARCHAR(255),
    points VARCHAR(1000)
);