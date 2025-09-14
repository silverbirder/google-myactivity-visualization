SELECT
    CAST(
        strftime ('%Y', CAST(time AS TIMESTAMP)) AS INTEGER
    ) AS year,
    CAST(
        strftime ('%m', CAST(time AS TIMESTAMP)) AS INTEGER
    ) AS month,
    -- ワードクラウドのデータがあるかどうか
    CASE
        WHEN COUNT(
            CASE
                WHEN header = '検索'
                AND titleUrl LIKE 'https://www.google.com/search?%' THEN 1
            END
        ) > 0 THEN true
        ELSE false
    END AS has_word_cloud_data,
    -- 位置情報マップのデータがあるかどうか
    CASE
        WHEN COUNT(
            CASE
                WHEN locationInfos IS NOT NULL
                AND locationInfos != '[]'
                AND locationInfos LIKE '%url%' THEN 1
            END
        ) > 0 THEN true
        ELSE false
    END AS has_location_data
FROM
    activities
GROUP BY
    year,
    month
ORDER BY
    year DESC,
    month DESC;