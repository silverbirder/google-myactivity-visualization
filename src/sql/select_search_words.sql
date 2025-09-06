SELECT
    url_decode (regexp_extract (titleUrl, '[?&]q=([^&]+)', 1)) AS searched_word
FROM
    activities
WHERE
    header = '検索'
    AND titleUrl LIKE 'https://www.google.com/search?%'
LIMIT
    __LIMIT__;