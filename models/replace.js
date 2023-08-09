module.exports = (temp, data) => {
    let output = temp.toString().replace(/{%TITLE%}/g, data.title);
    output = output.replace(/{%SUBJECT%}/g, data.subject);
    output = output.replace(/{%SRC%}/g, data.src);
    output = output.replace(/{%LINK%}/g, data.link);

    return output;
}