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
    guildId VARCHAR(100) NOT NULL,
    noSugg BIGINT(255) NOT NULL,
    Author VARCHAR(300) NOT NULL,
    Message VARCHAR(50000) NOT NULL,
    Moderator VARCHAR(300) NOT NULL,
    LAST_EDITED TIMESTAMP NOT NULL,
    STATUS VARCHAR(300) NOT NULL DEFAULT 'Needs votes!',
    UNIQUE KEY(guildId, Author)
);

CREATE TABLE Challenges (
    guildId VARCHAR(100) NOT NULL,
    player VARCHAR(300) NOT NULL,
    challengeAnnouncementsChannel VARCHAR(100) NOT NULL,
    submissionsDumpChannel VARCHAR(100) NOT NULL,
    challengeParticipants VARCHAR(100) NOT NULL,
    UNIQUE KEY(guildId, player)
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
    msgId BIGINT(255) NOT NULL,
    moderator VARCHAR(300) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description VARCHAR(50000) NOT NULL,
    dayNo INT(255) NOT NULL,
    LAST_EDITED TIMESTAMP NOT NULL,
    UNIQUE KEY(guildId,msgId)
);

CREATE TABLE Submissions (
    guildId VARCHAR(100) NOT NULL,
    msgId BIGINT(255) NOT NULL,
    Author VARCHAR(300) NOT NULL,
    Message VARCHAR(50000) NOT NULL,
    LAST_EDITED TIMESTAMP NOT NULL,
    dayNo INT(255) NOT NULL,
    UNIQUE KEY(guildId,msgId)
);