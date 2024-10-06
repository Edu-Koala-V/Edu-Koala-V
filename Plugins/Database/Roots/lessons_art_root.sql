INSERT INTO lessons_art 
(`id`, `article_content`, `tags`, `created_at`, `updated_at`, `authors`, `quiz_id`, `flashcard_id`) 
VALUES 
(
    NULL, 
    '[
        {"type": "br", "sectionID": "section1", "elementContent": "</br>"},
        {"type": "h2", "sectionID": "section1", "elementContent": ["Lekcja 1", "green"]},
        {"type": "text", "sectionID": "section1", "elementContent": ["Dawaj wbijaj:", ""]},
        {"type": "link", "sectionID": "section1", "elementContent": ["https://www.youtube.com/watch?v=3yZDDr0JKVc", "Logarytm"]},
        {"type": "text", "sectionID": "section1", "elementContent": ["No na co czekasz?", ""]},
        {"type": "text", "sectionID": "section1", "elementContent": ["No na co czekasz?", ""]},
        {"type": "br", "sectionID": "section1", "elementContent": "</br>"},
        {"type": "h2", "sectionID": "section2", "elementContent": ["No na co czekasz?", ""]},
        {"type": "table", "sectionID": "section2", "elementContent": ["<tbody><tr><th>1</th><th>2</th><th>3</th><th>4</th></tr><tr><td>2</td><td>3</td><td>4</td><td>57</td></tr><tr><td>3</td><td>4</td><td>5</td><td>6</td></tr><tr><td>4</td><td>5</td><td>6</td><td>7</td></tr></tbody>", "4x4"]},
        {"type": "img", "sectionID": "section2", "elementContent": ["WindowsServer.png", "/1/WindowsServer.png", "533", "300", "Na obrazku jest Windows Server 2019"]},
        {"type": "img", "sectionID": "section2", "elementContent": ["P2P.jpg", "/2/P2P.jpg", "533", "300", "Na obrazku jest połączenie Per to Per"]}

    ]', 
    'test', 
    current_timestamp(), 
    current_timestamp(), 
    'Zbrzeźniak Kamil', 
    1
)
