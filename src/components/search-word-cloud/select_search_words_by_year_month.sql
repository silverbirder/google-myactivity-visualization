SELECT
    url_decode (regexp_extract (titleUrl, '[?&]q=([^&]+)', 1)) AS searched_word
FROM
    activities
WHERE
    header = '検索'
    AND titleUrl LIKE 'https://www.google.com/search?%'
    AND CAST(
        strftime ('%Y', CAST(time AS TIMESTAMP)) AS INTEGER
    ) = __YEAR__
    AND CAST(
        strftime ('%m', CAST(time AS TIMESTAMP)) AS INTEGER
    ) = __MONTH__