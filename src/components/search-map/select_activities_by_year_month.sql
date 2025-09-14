SELECT
    time,
    locationInfos,
    UNNEST(json_extract(products, '$')::VARCHAR[]) AS product
FROM
    activities
WHERE
    strftime ('%Y', CAST(time AS TIMESTAMP)) = ?
    AND strftime ('%m', CAST(time AS TIMESTAMP)) = ?;