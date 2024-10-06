function convertURLToString(lessonTitle){
    lessonTitle = lessonTitle.replace(/-/g, " ");
    lessonTitle = lessonTitle.replace(/_/g, "-");
    lessonTitle = lessonTitle.replace(/'a/g, 'ą');
    lessonTitle = lessonTitle.replace(/'c/g, 'ć');
    lessonTitle = lessonTitle.replace(/'e/g, 'ę');
    lessonTitle = lessonTitle.replace(/'l/g, 'ł');
    lessonTitle = lessonTitle.replace(/'n/g, 'ń');
    lessonTitle = lessonTitle.replace(/'o/g, 'ó');
    lessonTitle = lessonTitle.replace(/'s/g, 'ś');
    lessonTitle = lessonTitle.replace(/''z/g, 'ź');
    lessonTitle = lessonTitle.replace(/'z/g, 'ż');
    return String(lessonTitle);
}
function convertStringURL(lessonTitle){
    lessonTitle = lessonTitle.replace(/-/g, "_");
    lessonTitle = lessonTitle.replace(/ /g, "-");
    lessonTitle = lessonTitle.replace(/ą/g, "'a");
    lessonTitle = lessonTitle.replace(/ć/g, "'c");
    lessonTitle = lessonTitle.replace(/ę/g, "'e");
    lessonTitle = lessonTitle.replace(/ł/g, "'l");
    lessonTitle = lessonTitle.replace(/ń/g, "'n");
    lessonTitle = lessonTitle.replace(/ó/g, "'o");
    lessonTitle = lessonTitle.replace(/ś/g, "'s");
    lessonTitle = lessonTitle.replace(/ź/g, "''z");
    lessonTitle = lessonTitle.replace(/ż/g, "'z");
    return String(lessonTitle);
}