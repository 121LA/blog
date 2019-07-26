module.exports.showpage = function(data,show_count,curPage){
    var totalPage,
		showData
	curPage = Number(curPage) || 1
	totalPage = Math.ceil(data.length / show_count);
	if (curPage >= totalPage) {
		curPage = totalPage
	}
	if (curPage <= 1) {
		curPage = 1
	}
	showData = data.slice(curPage * show_count - show_count, curPage * show_count);
	return {
		totalPage,
		showData,
		curPage
	}
}