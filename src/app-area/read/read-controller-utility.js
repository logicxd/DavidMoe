
/* #region  Title */
/**
 * Tries to find title and alternative titles or chapters
 * @param {string} unfluffTitle title parsed using unfluff
 * @param {Object} loadedCheerio html-loaded cheerio
 * @returns {string[]} an array of ['Text Title', 'Alt. title 1', 'Alt. Title 2', ...] 
 */
function findTextTitle(unfluffTitle, loadedCheerio) {
    var titleCandidates = [unfluffTitle];
    var selectors = ['h1', 'h2', 'h3', 'p:contains("Chapter")'];
    var textTitles = [unfluffTitle];
    var subTitleSet = new Set([unfluffTitle]);
    try {
        // Grab possible content titles from `selectors` elements
        for (var i = 0; i < selectors.length; ++i) {
            loadedCheerio(selectors[i]).contents().each(function (i, node) {
                if (node.data != null) {
                    var title = node.data.trim();
                    if (title.length > 0) {
                        titleCandidates.push(title);

                        // 'h1' selectors are added as alternative title
                        if (selectors[i] === 'h1') {
                            subTitleSet.add(title);
                        }
                    }
                }
            });
        }
        // Determine text title
        titleCandidates.forEach(title => {
            var useTitle = title.length >= textTitles[0].length;
            useTitle &= title.toLowerCase().includes('chapter');
            if (useTitle) {
                textTitles[0] = title;
            }
        });
        subTitleSet.delete(textTitles[0]);
        subTitleSet.forEach(subTitle => {
            textTitles.push(subTitle);
        });
    } catch (error) {
        console.error(error);
        textTitles = [unfluffTitle];
    }
    return textTitles;
}

/**
 * Gets alternative titles text
 * @param {string[]} textTitles array of titles found
 * @returns {string} comma separated string to represent alternative titles
 */
function getAlternativeTitleString(textTitles) {
    var titles = textTitles.slice(1);
    var titleString = '';
    for (var i = 0; i < titles.length && i < 5; ++i) {
        titleString += `${i > 0 ? ',' : ''} ${titles[i]}`;
    }
    return titleString;
}
/* #endregion */

/* #region  Next Page URL*/
/**
 * Attempts to find the "Next" page link for the given website
 * @param {string[]} unfluffLinks array of links found using unfluff
 * @param {Object} loadedCheerio html-loaded cheerio
 * @param {string} sourceUrl base URL of the website visiting
 */
function findNextPageLink(unfluffLinks, loadedCheerio, sourceUrl) {
    var nextPageLink = findNextPageLinkUsingUnfluff(unfluffLinks)
    nextPageLink = nextPageLink === '' ? findNextPageLinkUsingCheerio(loadedCheerio) : nextPageLink
    nextPageLink = turnURLIntoAbsolutePathIfNeeded(nextPageLink, sourceUrl)
    return nextPageLink
}

function findNextPageLinkUsingUnfluff(links) {
    var link = '';
    for (var i = links.length - 1; i >= 0; --i) {
        var linkObject = links[i];
        var linkText = linkObject.text.toLowerCase();
        if (linkText.includes('next')) {
            link = linkObject.href;
            break;
        }
    }
    return link;
}

function findNextPageLinkUsingCheerio(loadedCheerio) {
    var linkContents = loadedCheerio('a').contents();
    var link = '';
    try {
        for (var i = linkContents.length - 1; i >= 0; --i) {
            var node = linkContents.get(i);
            var foundNextLink = findNextPageLinkUsingCheerio_CheckForCurrentNodeData(node);
            foundNextLink = foundNextLink || findNextPageLinkUsingCheerio_CheckForChildrenNodeData(node);

            if (foundNextLink) {
                link = node.parent.attribs.href;
                break;
            }
        }
    } catch (error) {
        console.error(error);
    }
    return link;
}

function findNextPageLinkUsingCheerio_CheckForCurrentNodeData(node) {
    var nodeText = node.data;
    nodeText = nodeText == null ? '' : nodeText.toLowerCase();
    return nodeText.includes('next')
}

function findNextPageLinkUsingCheerio_CheckForChildrenNodeData(node) {
    if (!node.children) { return false; }

    for (var i = 0; i < node.children.length; ++i) {
        var childNode = node.children[i];

        if (!childNode.data) {
            continue;
        }
        if (childNode.data.toLowerCase().includes('next')) {
            return true;
        }
    }
    return false;
}
/* #endregion */

/* #region  URL Utility */
/**
 * Makes sure the given link is turned into an absolute URL string
 * @param {string} link an absolute or a relative URL
 * @param {string} baseUrl base domain to append relative URL to
 * @returns {string} absolute URL string
 */
function turnURLIntoAbsolutePathIfNeeded(link, baseUrl) {
    if (link === '' || isAbsoluteLink(link)) {
        return link;
    }

    var url = new URL(baseUrl);
    url.pathname = link;
    return url.toString();
}

function isAbsoluteLink(link) {
    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
    return r.test(link);
}
/* #endregion */

module.exports = {
    findTextTitle,
    findNextPageLink,
    getAlternativeTitleString,
}