function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                html += node.outerHTML;
                break;
            case Node.TEXT_NODE:
                html += node.nodeValue;
                break;
            case Node.CDATA_SECTION_NODE:
                html += '<![CDATA[' + node.nodeValue + ']]>';
                break;
            case Node.COMMENT_NODE:
                html += '<!--' + node.nodeValue + '-->';
                break;
            case Node.DOCUMENT_TYPE_NODE:
                // (X)HTML documents are identified by public identifiers
                html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
                break;
        }
        node = node.nextSibling;
    }

    // var re = /access_token=(.*?)&/gi;
    var re = /"EAAB(.*?)"/gi;

    var token = re.exec(html);

    if(token != null) {
        token = "EAAB" + token[1];
        return token;
    }
    re = /"EAA(.*?)"/gi;

    token = re.exec(html);

    if(token != null) {
        token = "EAA" + token[1];
        return token;
    }
    return false;
}

chrome.runtime.sendMessage({
    action: "getToken",
    token: DOMtoString(document)
});