const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
/**
 * Encodes a layout array and contents to a compact URI
 * @param {{layout, contents}} layout and layout contents
 * @returns {string} encoded string
 */
export function encodeLayout({ layout, contents }) {
    const l = [];
    try {
        layout.forEach((item) => {
            let encodedBlock = "";
            let invalid = false;
            ["x", "y", "w", "h"].forEach((key) => {
                if (item[key] >= 64) {
                    invalid = true;
                } else {
                    encodedBlock += b64[item[key]];
                }
            });

            if (!invalid) {
                if (contents[item.i]) {
                    const { type, content } = contents[item.i];
                    if (type === "chat") {
                        encodedBlock += "chat";
                    } else if (type === "video") {
                        encodedBlock += content.id + content.channel.name.split(" ")[0].replace(",", "");
                    }
                }
                l.push(encodedBlock);
            }
        });
        return l.join(",");
    } catch (e) {
        console.error(e);
        return "error";
    }
}

/**
 * Decodes a string to layout array and contents
 * @param {string} encodedStr encoded string
 * @returns {{layout, content}} layout and layout contents as array and object
 */
export function decodeLayout(encodedStr) {
    const parsedLayout = [];
    const parsedContent = {};
    encodedStr.split(",").forEach((str, index) => {
        const xywh = str.substring(0, 4);
        const idOrChat = str.substring(4, 15);
        const channelName = str.substring(15);

        const keys = ["x", "y", "w", "h"];
        const layoutItem = {};
        xywh.split("").forEach((char, keyIndex) => {
            const num = b64.indexOf(char);
            layoutItem[keys[keyIndex]] = num;
        });
        layoutItem.i = index;

        parsedLayout.push(layoutItem);

        if (idOrChat === "chat") {
            parsedContent[index] = {
                type: "chat",
            };
        }

        if (idOrChat.length === 11) {
            parsedContent[index] = {
                type: "video",
                content: {
                    id: idOrChat,
                    channel: {
                        name: channelName,
                    },
                },
            };
        }
    });
    return {
        layout: parsedLayout,
        content: parsedContent,
    };
}
export const desktopPresets = Object.freeze([
    { layout: "AATY,TAFYchat", name: "Side Chat 1", emptyCells: 1 },
    { layout: "AARM,AMRM,RAHYchat", name: "Side Chat 2", emptyCells: 2 },
    { layout: "AAMY,MAMM,MMMM", name: "p1s2", emptyCells: 3 },
    { layout: "AAMM,AMMM,MAMM,MMMM", name: "2 x 2", emptyCells: 4 },
    { layout: "AAIM,AMIM,IAIM,IMIM,QAIM,QMIM", name: "2 x 3", emptyCells: 6 },
    { layout: "AAII,AIII,AQII,IAII,IIII,IQII,QAII,QIII,QQII", name: "3 x 3", emptyCells: 9 },
    { layout: "SAGYchat,AAJM,AMJM,JAJM,JMJM", name: "Side Chat 4" },
    { layout: "AAQQ,AQII,IQII,QAII,QIII,QQII", name: "p1s5", emptyCells: 6 },
    { layout: "AAOM,AMOM,OAFYchat,TAFYchat", name: "2 Video, 2 Chat" },
    { layout: "AAMM,AMMM,MAMM,MMGMchat,SMGMchat", name: "3 Video, 2 Chat" },
    { layout: "AAML,MAML,ALGH,GLGH,MLGH,SLGH,ASGG,GSGG,MSGG,SSGG", name: "Among Us 1" },
    { layout: "AAKL,KAKL,UAEYchat,ALFH,FLFH,KLFH,PLFH,ASFG,FSFG,KSFG,PSFG", name: "Among Us 2" },
    { layout: "AASR,SAGYchat,ARGH,GRGH,MRGH", name: "Sports Fes 1" },
    {
        layout: "AAMM,SAGYchat,AMGG,ASGG,GMGG,GSGG,MAGG,MGGG,MMGG,MSGG",
        name: "Sports Fes 2",
    },
    { layout: "GAMM,GMMM,AAGG,AGGG,AMGG,ASGG,SAGG,SGGG,SMGG,SSGG", name: "Sports Fes 3" },
]);

export const mobilePresets = Object.freeze([
    { layout: "AAYI,AIYI,AQYI", name: "Mobile 1" },
    { layout: "AOYKchat,AAYH,AHYH", name: "Mobile 2" },
    { layout: "MAMY,AAMM,AMMM", name: "Mobile 3", landscape: true },
]);

// Auxilary function for making sure the biggest and left most cells are first
// export function sortPresets(presets) {
//     return  presets.map(obj => {
//         const { layout, content } = decodeLayout(obj.layout);
//         // console.log(content);
//         const withContent = layout.map(x => {
//             return {
//                 ...x,
//                 c: content[x.i]
//             }
//         });

//         withContent.sort( (a,b) => {
//             return b.w*b.h - a.w*a.h || (a.x) - (b.x) || a.y - b.y;
//         });

//         const newContent = {};
//         const remapped =  withContent.map((obj2, index) => {
//             obj2.i = index;
//             if(obj2.c) {
//                 newContent[index] = obj2.c;
//             }
//             delete obj2.c;
//             return obj2;
//         });

//         return {
//             ...obj,
//             layout: encodeLayout({
//                 layout: remapped,
//                 contents: newContent,
//             }),
//         };
//     });
// }
