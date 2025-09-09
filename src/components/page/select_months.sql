SELECT
    CAST(
        strftime ('%Y', CAST(time AS TIMESTAMP)) AS INTEGER
    ) AS year,
    CAST(
        strftime ('%m', CAST(time AS TIMESTAMP)) AS INTEGER
    ) AS month
FROM
    activities
GROUP BY
    year,
    month
ORDER BY
    year,
    month;