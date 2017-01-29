var log = lion.log;
$('<div>', {'id': 'd1'}).appendTo('body');
$('<div>', {'id': 'd2'}).appendTo('#d1');
for (var i = 0; i < 5; ++i) {
    $('<button>', {'id': 'btn' + i}).text('button' + i).appendTo('#d2');
}
window.lion = lion || {}
