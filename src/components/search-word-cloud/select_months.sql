SELECT
    CAST(
        strftime ('%Y', CAST(time AS TIMESTAMP)) AS INTEGER
    ) AS year,
    CAST(
        strftime ('%m', CAST(time AS TIMESTAMP)) AS INTEGER
    ) AS month
FROM
    activities
WHERE
    header = '検索'
    AND titleUrl LIKE 'https://www.google.com/search?%'
GROUP BY
    year,
    month
ORDER BY
    year,
    month;