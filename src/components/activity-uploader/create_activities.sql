CREATE TABLE
    IF NOT EXISTS activities AS
SELECT
    json_extract_string (json, '$.header') AS header,
    json_extract_string (json, '$.title') AS title,
    json_extract_string (json, '$.titleUrl') AS titleUrl,
    json_extract_string (json, '$.time') AS time,
    json_extract (json, '$.products') AS products,
    json_extract (json, '$.activityControls') AS activityControls,
    json_extract_string (json, '$.description') AS description,
    json_extract (json, '$.safeHtmlItem') AS safeHtmlItem,
    json_extract (json, '$.audioFiles') AS audioFiles,
    json_extract (json, '$.details') AS details,
    json_extract (json, '$.locationInfos') AS locationInfos,
    json_extract (json, '$.subtitles') AS subtitles
FROM
    read_json_objects ('__PATH__');