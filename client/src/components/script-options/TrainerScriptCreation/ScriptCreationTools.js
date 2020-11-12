import { HETEROGEN, HOMOGEN, SHUFFLE } from "../../../actions/types"
const skmeans = require("../../../../node_modules/skmeans")


//build  
export default  function mixGroups  (method, members, groupSize)  {
    if (!Array.isArray(members)&&(groupSize < members.length)) {
        return false;
    }
    else {
        var memberArray = Object.assign({}, members);
        var groups = [[]];

        switch (method) {
            case SHUFFLE: {
                let groupNr = 0;
                while (Array.isArray(memberArray) && memberArray.length > 0) {
                    let memberPosition = getRandomInt(0, memberArray.length);
                    if (!(groups[groupNr].length < groupSize))
                        groupNr++;
                    groups[groupNr].push(memberArray[memberPosition]);
                    memberArray.splice(memberPosition, 1);
                }
                return groups;

            }
            case HETEROGEN: {

            }
            case SHUFFLE: {

            }
        }
    }


}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}