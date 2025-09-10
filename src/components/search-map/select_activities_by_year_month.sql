SELECT
    time,
    locationInfos
FROM
    activities
WHERE
    strftime ('%Y', CAST(time AS TIMESTAMP)) = ?
    AND strftime ('%m', CAST(time AS TIMESTAMP)) = ?;