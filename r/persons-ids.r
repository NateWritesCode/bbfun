library("baseballr")

# Get player IDs
chadwick_frame <- chadwick_player_lu()
chadwick_frame <- chadwick_frame[
    !is.na(chadwick_frame$key_mlbam) & chadwick_frame$key_bbref != "" &
        !is.na(chadwick_frame$birth_year) &
        !is.na(chadwick_frame$birth_month) &
        !is.na(chadwick_frame$birth_day),
]
player_ids <- subset(chadwick_frame, select = c(
    "key_mlbam", "key_retro", "key_bbref", "key_bbref_minors", "key_fangraphs",
    "name_first", "name_last", "name_given", "name_suffix", "name_matrilineal", "name_nick",
    "birth_year", "birth_month", "birth_day"
))
names(player_ids) <- c(
    "mlbId", "retrosheetId", "bbRefId", "bbRefMinorsId", "fangraphsId",
    "firstName", "lastName", "givenName", "suffix", "matrilineal", "nickname",
    "birthYear", "birthMonth", "birthDay"
)
path_output <- file.path("data", "input", "historical", "persons")
print(path_output)
ifelse(!dir.exists(path_output), dir.create(path_output, recursive = TRUE, showWarnings = FALSE), FALSE)
write.csv(player_ids, file.path(path_output, "persons.csv"), na = "", row.names = FALSE)
