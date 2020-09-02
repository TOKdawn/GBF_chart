//文件操作对象
var fileOperation = {
	params:{
        pageSource:'diagrams',
        teamId:''
    },
    loading : false
};
fileOperation.func = function(tit, tp, id, callback){
    if(tit == "orgCopy"){
        Util.checkOrgExpire(function(result){
            if(!result){
                return false;
            }else{
                fileOperation[tit](id, tp);
            }
        },{orgId:orgId});
    }else{

        fileOperation[tit](id, tp);
    }
	if(callback != null){
		callback();
	}
};
fileOperation.view = function(id, tp){
    // window.location.href="/feishu/view/" + id;
    sessionStorage.setItem('FeishuRouterBackUrl', window.location.href);
    window.open('/feishu/view/'+id)
};
fileOperation.orientation = function(id, tp){
    pageContext.zhugeEvent('按钮点击',{'按钮名称':'文件操作_定位按钮','页面名称':''})
    Util.ajax({
        url : "/feishu/org/file/position",
        data:{chartId:id},
        type:'get',
        success : function(data) {
         if(data.result == "success"){
            //  debugger
            if(data.state == 'colla' ) {
                $('.nav-item[data-nav=colla]').addClass("active").siblings('.nav-item').removeClass("active");
                $('.teams-list .team-item').removeClass("active");
                pageContext.curNav = "colla"
                pageContext.params.curPage = data.curPage
                history.pushState(null, '', '/feishu/colla');
                pageContext.loadFiles("",id);
                }else if( data.teamId !=null ){
                    pageContext.params.folderId = data.folderId;
                    pageContext.params.teamId = data.teamId;
                    history.pushState(null, '', '/feishu/team/'+ data.teamId);
                    $('.nav-item[data-nav=diagrams]').removeClass("active");
                    $(".teams-list .team-item[tid=" + data.teamId+ "]").addClass("active")
                    pageContext.curNav = "team"
                    pageContext.loadFiles("",id); 
                }else{
                    pageContext.curNav = "owner"
                    pageContext.params.folderId = data.folderId;
                    $('.nav-item[data-nav=owner]').addClass("active").siblings('.nav-item').removeClass("active");
                    $('.teams-list .team-item').removeClass("active");
                    history.pushState(null, '', '/feishu/owner');
                    pageContext.loadFiles("",id);
                }
            }else{
                Util.globalLeftTip({content:'定位失败',delay:1000})
            }
        }
    });
};
fileOperation.searchOrientation = function(id, tp){
    pageContext.zhugeEvent('按钮点击',{'按钮名称':'文件操作_定位按钮','页面名称':''})
    Util.ajax({
        url : "/feishu/org/file/position",
        data:{chartId:id},
        type:'get',
        success : function(data) {
         if(data.result == "success"){
            $(".search-btn").children("input").css({
                width:0,
                opacity:0,
                padding:"0px"
            }).val('');
            pageContext.params.searchTitle  = '';
         if( data.teamId !=null ){
                    pageContext.params.folderId = data.folderId;
                    pageContext.params.teamId = data.teamId;
                    $('.nav-item[data-nav=diagrams]').removeClass("active");
                    $(".teams-list .team-item[tid=" + data.teamId+ "]").addClass("active")
                    pageContext.curNav = "team"
                    // history.pushState(null, '', '/feishu/team/'+ data.teamId);
                    pageContext.loadFiles("",id); 
                }else{
                    pageContext.curNav = "owner"
                    pageContext.params.folderId = data.folderId;
                    $('.nav-item[data-nav=owner]').addClass("active").siblings('.nav-item').removeClass("active");
                    $('.teams-list .team-item').removeClass("active");
                    history.pushState(null, '', '/feishu/owner');
                    pageContext.loadFiles("",id);
                }
            }else{
                Util.globalLeftTip({content:'定位失败',delay:1000})
            }
        }
    });
};
fileOperation.rename = function(id, tp){
	var con = $("#" + id), name = con.find("label:first").text();
	$("#dlg_new_folder").attr("title", "<@i18n resource='user.op.rename'/>");
	$("#dlg_new_folder").dialog();
	$("#folder_new_title").val(name).select();
	$("#btn_submit_folder").off().on("click", function(){
		if($("#folder_new_title").attr("submitting")){
			return; //如果正在提交，不进行提交，防止重复提交
		}
		var title = $.trim($("#folder_new_title").val());
		if(title == name){
			$("#dlg_new_folder").dialog("close");
			return;
		}
		if(title != ""){
			if(title.length > 60){
				title = title.substring(0, 60);
			}
			var data = {title: title, ignore: "title"};
			var url = "";
			if(tp == "folder"){
				data.folderId = id;
				url = "/folder/rename";
			}else{
				data.chartId = id;
				url = "/folder/rename/chart";
			}
			$("#folder_new_title").attr("submitting", "true"); //标识正在提交
			Util.ajax({
				url: url,
				data:data,
				success:function(data){
					if(data.result == "success"){
						$("#dlg_new_folder").dialog("close");
						$("#folder_new_title").val("");
						con.find("label:first").text(title);
					}
					$("#folder_new_title").removeAttr("submitting");
				}
			});
		}else{
			$("#folder_new_title").focus();
		}
	});
	$("#folder_new_title").off("keyup").on("keyup", function(e){
		if(e.keyCode == 13){
			$("#btn_submit_folder").trigger("click");
			return;
		}
	});
};
fileOperation.colla = function(id, tp){
	$("#colla_add").dialog();
	pageContext.collaboration.init(id, tp);
	$("#colla_add .colla-suggest-box").empty();
	$("#add_step2").hide();
	$("#add_step1").show();
};
fileOperation.collaStatic = function(id, tp){
	$("#colla_add").dialog();
	pageContext.collaboration.init(id, tp);
	$("#colla_add .colla-suggest-box").empty();
	$("#add_step2").hide();
	$("#add_step1").show();
};
fileOperation.detail = function(id, tp){
	var con = $('.team-updates'),conTitle = $('.updates-title');
	con.addClass('active');
	$('.po-timeline').empty();
	if(!conTitle.length){
		con.append('<div class="updates-title"><span class="updates-title-text">文件详情</span><span class="updates-close-btn icons">&#xe637;</span></div><div class="po-timeline-box"><div class="po-timeline"></div></div><div class="updates-bot-loadding"></div></div>')
	}else{
		$('.updates-title-text').text('文件详情')
	}
	pageContext.util.loadingball({con:con});
	if(pageContext.isLoading){
		return;
	}
	if(typeof teamUpdate == "undefined"){
		var objs = {
			css:["/assets/css/teamupdates.css"],
			js:["/assets/js/team-updates.js"]
		};
		bigPipe.render(objs,function(){
			teamUpdate.params.reference = id;
			teamUpdate.params.fileType = tp;
			pageContext.isLoading = true;
			teamUpdate.init();
		});
	}else{
		teamUpdate.params.reference = id;
		teamUpdate.params.fileType = tp;
		pageContext.isLoading = true;
		teamUpdate.init();
	}

};
fileOperation.del = function(id, tp){
   
	var con = $("#" + id), title = con.find("label").text();
	title = Util.filterXss(title);
	//项目组文档del操作
	if(tp == 'notes'){
		$.confirm({
			content: "<@i18n resource='del.you_will'/>&nbsp;<i><b>" + title + "</b></i>&nbsp;&nbsp;<@i18n resource='del.del_sure'/><br><br><@i18n resource='del.del_not_recover'/>",
			onConfirm: function(){
				Util.loading({show:true, content:"<@i18n resource='del.deleting'/>"});
				Util.ajax({
					url:"/team/del_note",
					data:{fileType: tp, fileId: id, resource: ""},
					success:function(data){
                        // debugger
						if(data.result == "success"){
                            pageContext.loadFiles();
							con.remove();
						}
						Util.loading("close");
						Util.globalTopTip('<@i18n resource="del.del_succ"/>', 'top_success', 1500, $(".con-right"), true);
					}
				});
			}
		});
		return;
	}
	$.confirm({
		content: "<@i18n resource='del.you_will'/>&nbsp;<i><b>" + title + "</b></i>&nbsp;&nbsp;<@i18n resource='del.remove_sure'/><br><br><@i18n resource='del.desc'/>",
		onConfirm: function(){
			Util.loading({show:true, content:"<@i18n resource='del.deleting'/>"});
			Util.ajax({
				url:"/folder/to_trash",
				data:{fileType: tp, fileId: id, resource: ""},
				success:function(data){
					if(data.result == "success"){
                        con.remove();
						pageContext.loadFileCount();
                        pageContext.loadFiles();
					}
					Util.loading("close");
					Util.globalTopTip('<@i18n resource="del.del_succ"/>', 'top_success', 1500, $(".con-right"), true);
					var fileLength = $('.file-list').find('.file-list-item').length || $('.file-list').find('.list-item').length;
					if(fileLength < 1){
						var emptyFile = '<div class="nofiles"><img src="/assets/images/icon/empty_file.svg"><div><@i18n resource="del.no_file"/></div></div>';
						$('.file-list').append(emptyFile);
					}
				}
			});
		}
	});
};
fileOperation.uncolla = function(id, tp){
	var con = $("#" + id), title = con.find("label").text();
	$.confirm({
		content: "<@i18n resource='colla.will_exit'/><b><i>" + title + "</i></b><br><@i18n resource='colla.will_exit_intro'/>",
		onConfirm: function(){
			Util.loading({show:true, content:"<@i18n resource='user.in_operation'/>"});
			Util.ajax({
				url:"/folder/to_trash",
				data:{fileType:tp, fileId:id, resource:"colla"},
				success:function(data){
					con.remove();
                    Util.loading("close");
                    Util.ajax({
                        url:"/feishu/workbench/history/delete?chartId="+ id,
                        type: "GET",
                        success:function(data){
                            return ;
                        }
                    })
					Util.globalTopTip('<@i18n resource="colla.exit_succ"/>', 'top_success', 1500, $(".con-right"), true);
                    //Util.globalLeftTip({content:'退出成功',delay:1000})
				}
			});
		}
	});
};
fileOperation.unfav = function(id, tp){
	var con = $("#" + id), title = con.find("label").text();
	var param = {fileType:tp, fileId:con.attr("favId"), resource:"fav"};
	$.confirm({
		content: "您确认取消收藏&nbsp;<b><i>" + title + "</i></b>&nbsp; 文件？",
		onConfirm: function(){
			Util.loading({show:true, content:"操作中..."});
			Util.ajax({
				url:"/folder/to_trash",
				data:param,
				success:function(data){
					con.remove();
					Util.loading("close");
					Util.globalTopTip('取消成功', 'top_success', 1500, $(".con-right"), true);
                    //Util.globalLeftTip({content:'取消成功',delay:1000})
				}
			});
		}
	});
};
fileOperation["delete"] = function(id, tp){
	var con = $("#" + id), title = con.find("label").text();
	var param = {fileType:"", fileId:""};
	param.fileId = id;
	param.fileType = tp;
	var content = "<@i18n resource='del.you_will'/>&nbsp;<b><i>" + title + "</i></b>&nbsp;&nbsp;<@i18n resource='del.del_trash_sure'/><br><@i18n resource='del.del_trash_desc'/>";
	$.confirm({
		content: content,
		onConfirm: function(){
			Util.loading({show:true, content:"<@i18n resource='del.deleting'/>"});
			Util.ajax({
				url:"/folder/remove_from_trash",
				data:param,
				success:function(data){
					con.remove();
					pageContext.loadFileCount();
					Util.loading("close");
					Util.globalTopTip('<@i18n resource="del.del_succ"/>', 'top_success', 1500, $(".con-right"), true);
                    //Util.globalLeftTip({content:'删除成功',delay:10000000})
					var fileLength = $('.file-list').find('.file-list-item').length;
					if(fileLength < 1){
						var emptyFile = '<div class="nofiles"><img src="/assets/images/icon/empty_file.svg"><div><@i18n resource="del.no_file"/></div></div>';
						$('.file-list').append(emptyFile);
					}

				}
			});
		}
	});
};
fileOperation.restore = function(id, tp){
	var con = $("#" + id), title = con.find("label").text();
	var param = {fileType:"", fileId:""};
	param.fileId = id;
	param.fileType = tp;
	if( fileOperation.params.pageSource == "team"){
		param.teamId = fileOperation.params.teamId;
     }
    if(typeof orgId != "undefined"){
        param.orgId = orgId;
    }
	var content = "<@i18n resource='del.you_will'/>&nbsp;<b><i>" + title + "</i></b>&nbsp;&nbsp;<@i18n resource='del.restore_sure'/>";
	$.confirm({
		content: content,
		onConfirm: function(){
			Util.loading({show:true, content:"<@i18n resource='del.restoring'/>"});
			Util.ajax({
				url:"/folder/restore",
				data:param,
				success:function(data){
					con.remove();
					Util.loading("close");
					Util.globalTopTip('<@i18n resource="del.restore_succ"/>', 'top_success', 1500, $(".con-right"), true);
                    //Util.globalLeftTip({content:'还原成功',delay:1000})
				}
			});
		}
	});
};
fileOperation.clone = function(id, tp){
    
	var con = $("#" + id), title = con.find("label").text();
	var cate = con.attr("cate");
	var ca = "";
	if(cate.indexOf("mind") >= 0){
		ca = "&category=" + cate;
	}
	var params = {};
	if(orgId){
		var teamId = pageContext.params.teamId;
		var urlTeamParam = '', urlFolderParam = "&folder="+ pageContext.params.folderId || "";
		if(fileOperation.params.pageSource == "team"){
			urlTeamParam = "&team=" + teamId;
		}
		ca += "&org=" + orgId + urlTeamParam + urlFolderParam;
		params.orgId = orgId;
		
		if(typeof teamId != "undefined" && teamId != ""){
			params.teamId = teamId || "";
		}
		Util.checkOrgExpire(function(result){
			if(!result){
				return false;
			}else{
				window.location = "/feishu/diagraming/new?template=" + id + ca;
			}
		}, params);
	}else{
		//个人文件
        // Util.checkFileCount(function(result){
        //     if(result == false){
        //         window.location = "/upgrade";
        //     }else{
        //         window.location = "/feishu/diagraming/new?template=" + id + ca;
        //     }
        // },{});
    }


};
// fileOperation.export = function (id,tp) {  
// 	if(!id) return ;
//     $.confirm({
//         content: "您将要将文件导出至个人文件根目录中",
//         onConfirm: function () {
//             Util.loading({show:true, content:"正在导出至个人文件中..."});
//             Util.ajax({
//                 url : "/folder/movetouser",
//                 data: {chartId: id},
//                 success : function(data) {
//                     Util.loading("close");
//                     if(data.result == "success"){
//                     	setTimeout(function () {
// 							Util.globalTopTip('成功导出至个人文件', 'top_success', 1500, $(".con-right"), true);
//                             //Util.globalLeftTip({content:'导出至个人文件成功',delay:1000})
//                         },2000);
//                     }else if(data.result == "files"){
// 						Util.globalTopTip('导出失败，请检查个人文件容量后重试', 'top_error', 1500, $(".con-right"), true);
//                        // Util.globalLeftTip({content:'导出失败，请检查个人文件容量后重试',delay:1000})
//                     }
//                 }
//             });
//         }
//     });
//
// };
fileOperation.down = function(id, tp){
	var con = $("#" + id),
		title = con.find("label").text(),
		cate = con.attr("cate");
	//项目组文档下载操作
	if(tp == "notes"){
		window.open('/team/download?documentId='+id);
		return;
	}
    var exportBox = $('#export-box');
    if(!expire){
        $('.imgItem').css('display','block')
    }else{
        $('.imgItem').css('display','none')
    }
	if(cate.indexOf("mind") >= 0){
		exportBox.removeClass('mindonly').addClass('mindonly');
		//$("#export_svg").parent().removeClass("disable");
		if(false){   //不是会员
			exportBox.find('.export-list.mindvip').removeClass('disable').addClass('disable');
		}else{
			exportBox.find('.export-list.mindvip').removeClass('disable');
		}
		//$("#export_xmind, #export_fmind").parent().show();
		//$("#export_pdfHD").parent().addClass("disable");
		$("#export_form").attr("action", imagePath + "/diagram_export/mind");
	}else if(cate.indexOf("network") >= 0){
		exportBox.removeClass('mindonly');
		//$("#export_xmind, #export_fmind").parent().hide();
		$("#export_svg, #export_pdfHD").parent().addClass("disable");
		$("#export_form").attr("action", imagePath + "/diagram_export");
	}else{
		exportBox.removeClass('mindonly');
		//$("#export_xmind, #export_fmind").parent().hide();
		$("#export_svg, #export_pdfHD").parent().removeClass("disable");
		$("#export_form").attr("action", imagePath + "/diagram_export");
	}
	$("#dlg_export").dialog();
	$("#export_submit").off().on('click', function(e){
		$("#dlg_export").dialog("close");
		Util.loading({show:10000, delay:500});
		var type = $("input[name=export-format]:checked").val();
		if(cate.indexOf("mind") >= 0){
			$("#export_mind").val("mind");
		}else{
			$("#export_mind").val("");
		}
		$("#export_type").val(type);
		$("#export_id").val(id);
        if($("#export_mind").val() == "" && (type == "svg" || type == "image" || type == "jpg" || type == "png" ||type == "pdfHD" )){
            var iframe_svg = $("<div id='iframe_svg' style='visibility:hidden;opacity:0;position: fixed;z-index: 0;width: 100%;height: 100%;'><iframe style='width: 100%;' src='/feishu/diagraming/"+ id + "'></iframe></div>").appendTo("body");
            iframe_svg.find("iframe").on("load", function(e) {
            	if(type == "png"){
            		type = "png_hd";
            	}
                var nodes = $(this).contents();
                nodes.find("#export_" + type).trigger("click");
                setTimeout(function(){
                    nodes.find("#export_ok").trigger("click");
                    Util.loading("close");
				}, 2000);
                setTimeout("iframe_svg.remove()", 8000);
            });
            return;
        }
		if($("#export_mind").val() == "mind" && (type == "svg" || type == "pnghd" || type == "jpg" || type == "image")){
			var iframe_svg = $("<div id='iframe_svg' style='visibility:hidden;opacity:0;position: fixed;z-index: 0;width: 100%;height: 100%;'><iframe style='width: 100%;' src='/feishu/mindmap/"+ id + "'></iframe></div>").appendTo("body");
			iframe_svg.find("iframe").on("load", function(e) {
				var nodes = $(this).contents();
				if(type == "pnghd"){
					type = "pngHD";
				}
				nodes.find("#export_" + type).trigger("click");
                setTimeout(function(){
                    nodes.find("#btn-download").trigger("click");
                    Util.loading("close");
                }, 2000);
				setTimeout("iframe_svg.remove()", 8000);
			});
			return;
		}
		Util.loading("close");
		$("#export_form").submit();
		$("#export_submit").disable();
		setTimeout(function(){
			$("#export_submit").enable();
		}, 2000);
	});
	//待集成
};
fileOperation.pubpo = function(id, tp){
	pageContext.files.pubpoWin(id);
};
fileOperation.share = function(id, tp){
	pageContext.files.shareWin(id);
};
fileOperation.copy = function(id, tp){
    
    fileOperation.loading = false;
    $("#dlg_copy").dialog();
	$("#dlg_copy .selection.active").removeClass("active");
	if($("#dlg_copy .selection > .text").attr("folderId") == $(".dir .active").data("f-id"))
		$("#btn_submit_move").disable();
	else
		$("#btn_submit_move").enable();
	$("#btn_submit_move").off().on("click", function(){
		if($("#dlg_copy .selection > .text").attr("folderId") == $(".dir .active").data("f-id")){
			return;
		}
		move_copy_click("move");
	});

	$("#btn_submit_copy").off().on("click", function(){
		move_copy_click("copy");
	});
	if(fileOperation.params.pageSource == 'team'){
		$(".selection > .text").text("项目组文件");
	}else if(fileOperation.params.pageSource == 'org'){
        $(".selection > .text").text("企业文件");
    }else{
		$(".selection > .text").text("我的文件");
	}
	$(".selection > .text").attr("folderId", "root");
	$("#dlg_copy .selection").off("click.menu").on("click.menu", function(e){
		e.stopPropagation();
		$(this).toggleClass("active");
		if(!$(this).hasClass("active")){
			return;
		}
		if(fileOperation.params.pageSource == 'team'){
			loadTeamsFileList();
			return;
		}else if(fileOperation.params.pageSource == 'org'){
            loadOrgsFileList();
            return;
        }
		loadFileList();
	});
	$("#dlg_copy").off("click.menu").on("click.menu", function(){
		$("#dlg_copy .selection.active").removeClass("active");
	});
	function move_copy_click(type){
		var params = {};
        //企业里
        
        /*


        */
		if(orgId){
			params.orgId = orgId;
			//项目组文件
			if(pageContext.params.teamId){
				params.teamId = pageContext.params.teamId || "";
			}else{
				params.teamId = "";
			}
			Util.checkOrgExpire(function(result){
                if(!result){
                    return false;
                }else{
                    move_copy(type)
                }
            },params);
		}
		//个人文件
		else{}
	}
	function move_copy(type){
		url = (type == "move" ? "/folder/move" : "/folder/copy");
		var folderId = $(".selection > .text").attr("folderId");
        Util.loading({show:true, content:"正在操作中"});
        if(fileOperation.loading == true){
            return;
        }
        fileOperation.loading = true;
		Util.ajax({
			url: url,
			data: {fileType: tp, fileId: id, target: folderId, teamId: (pageContext.params.teamId ||""), orgId: (orgId || "")},
			success: function(data){
                Util.loading("close");
				if(data.result == "overed"){
					Util.globalTopTip("您的文件数量不足，无法创建新的文件, 您可以<a href='/upgrade'>去升级账号</a>", 'top_error', '3000', $("#dlg_copy"), true);
					return;
				}else if(data.result == "notexist"){
					Util.globalTopTip("文件夹不存在", 'top_error', '3000', $("#dlg_copy"), true);
					return;
				}else if(data.result == "notsame"){
					Util.globalTopTip("没有权限操作此文件夹", 'top_error', '3000', $("#dlg_copy"), true);
					return;
				}else if(data.result == "children"){
					Util.globalTopTip("不能将文件移动至当父文件夹或子文件夹下", 'top_error', '3000', $("#dlg_copy"), true);
					return;
				}else{
					pageContext.loadFiles();
					pageContext.loadFileCount();
				}
                $("#dlg_copy").dialog("close");
				Util.globalTopTip('操作成功', 'top_success', 1500, $(".con-right"), true);
				//清空选中
				$(document).trigger("click.file-op");
			}
		});		
	}
	function loadTeamsFileList(){
		var menu = $("#dlg_copy .selection > .content-menu").empty();
		Util.ajax({
			url: "/folder/getTeamfolder",
			data:{teamId:pageContext.params.teamId},
			success: function(data){
				menu.html("<div class='item' folderId='root'><span><span class='icons'>&#xe633;</span><span class='text'>项目组文件</span></span></div>");
				load(data.folders, "root", 2);
				menu.find(".item").off().on("click", function(e){
					e.stopPropagation();
					var text = $(this).find(".text:eq(0)").text();
					var folderId = $(this).attr("folderId");
					$(".selection > .text").text(text);
					$(".selection > .text").attr("folderId", folderId);
					$("#dlg_copy").trigger("click.menu");
					if(folderId == $(".dir .active").data("f-id") || $(this).parents("div[folderId=" + id + "]").length > 0 || folderId == id)
						$("#btn_submit_move").disable();
					else
						$("#btn_submit_move").enable();
				});
				if($("#dlg_copy .selection > .text").attr("folderId") == $(".dir .active").data("f-id"))
					$("#btn_submit_move").disable();
				else
					$("#btn_submit_move").enable();
			}
		});
		function load(data, pId, index){
			var folders = data[pId];
			var pfolder = menu.find("div[folderId=" + pId + "]").addClass("tree");
			$.each(folders, function(i, f){
				pfolder.append("<div class='item' folderId='" + f.folderId + "'><span style='padding-left:" + (index * 12) + "px;'><span class='icons'>&#xe633;</span><span class='text'>" + f.title + "</span></div>");
				if(data.hasOwnProperty(f.folderId))
					load(data, f.folderId, index + 1);
			});
		}
	}
    function loadOrgsFileList(){
        var menu = $("#dlg_copy .selection > .content-menu").empty();
        Util.ajax({
            url: "/folder/getOrgfolder",
            data:{orgId: orgId},
            success: function(data){
                menu.html("<div class='item' folderId='root'><span><span class='icons'>&#xe633;</span><span class='text'>企业文件</span></span></div>");
                load(data.folders, "root", 2);
                menu.find(".item").off().on("click", function(e){
                    e.stopPropagation();
                    var text = $(this).find(".text:eq(0)").text();
                    var folderId = $(this).attr("folderId");
                    $(".selection > .text").text(text);
                    $(".selection > .text").attr("folderId", folderId);
                    $("#dlg_copy").trigger("click.menu");
                    if(folderId == $(".dir .active").data("f-id") || $(this).parents("div[folderId=" + id + "]").length > 0 || folderId == id)
                        $("#btn_submit_move").disable();
                    else
                        $("#btn_submit_move").enable();
                });
                if($("#dlg_copy .selection > .text").attr("folderId") == $(".dir .active").data("f-id"))
                    $("#btn_submit_move").disable();
                else
                    $("#btn_submit_move").enable();
            }
        });
        function load(data, pId, index){
            var folders = data[pId];
            var pfolder = menu.find("div[folderId=" + pId + "]").addClass("tree");
            $.each(folders, function(i, f){
                pfolder.append("<div class='item' folderId='" + f.folderId + "'><span style='padding-left:" + (index * 12) + "px;'><span class='icons'>&#xe633;</span><span class='text'>" + f.title + "</span></div>");
                if(data.hasOwnProperty(f.folderId))
                    load(data, f.folderId, index + 1);
            });
        }
    }
	function loadFileList(){
		var menu = $("#dlg_copy .selection > .content-menu").empty();
		Util.ajax({
			url: "/feishu/folder/getfolderdata",
			success: function(data){
				menu.html("<div class='item' folderId='root'><span><span class='icons'>&#xe633;</span><span class='text'>我的文件</span></span></div>");
				load(data.folders, "root", 2);
				menu.find(".item").off().on("click", function(e){
					e.stopPropagation();
					var text = $(this).find(".text:eq(0)").text();
					var folderId = $(this).attr("folderId");
					$(".selection > .text").text(text);
					$(".selection > .text").attr("folderId", folderId);
					$("#dlg_copy").trigger("click.menu");
					if(folderId == $(".dir .active").data("f-id") || $(this).parents("div[folderId=" + id + "]").length > 0 || folderId == id)
						$("#btn_submit_move").disable();
					else
						$("#btn_submit_move").enable();
				});
				if($("#dlg_copy .selection > .text").attr("folderId") == $(".dir .active").data("f-id"))
					$("#btn_submit_move").disable();
				else
					$("#btn_submit_move").enable();
			}
		});
		function load(data, pId, index){
			var folders = data[pId] || [];
			var pfolder = menu.find("div[folderId=" + pId + "]").addClass("tree");
			$.each(folders, function(i, f){
				pfolder.append("<div class='item' folderId='" + f.folderId + "'><span style='padding-left:" + (index * 12) + "px;'><span class='icons'>&#xe633;</span><span class='text'>" + f.title + "</span></div>");
				if(data.hasOwnProperty(f.folderId))
					load(data, f.folderId, index + 1);
			});
		}
	}
};
fileOperation.orgCopy = function(id, tp){
	$("#dlg_copy").dialog().css({'width': '556px'});
	var menu = $("#dlg_copy .content-menu"), fId = $(".dir .files-nav-item.active").data("f-id"), nextFolderList = {};
	initFolderList();
//	$(".selection > .text").text(Orginfo.orgName);
	$("#btn_submit_move").off().on("click", function(){
		if(!menu.find(".copy-folder-name h2").hasClass("active")){
			Util.globalTopTip("<@i18n resource='user.select_folder'/>", 'top_error', '3000', $("#dlg_copy"), true);
			return;
		}
        if(typeof pageContext.params.teamId != "undefined" || typeof orgId != "undefined"){
            var params = {};
            params.teamId = typeof pageContext.params.teamId != "undefined" ? pageContext.params.teamId : "";
            params.orgId = typeof orgId != "undefined" ? orgId : "";
            Util.checkOrgExpire(function(result){
                if(!result){
                    return false;
                }else{
                	if(tp == "folder"){
                		move_copy("/folder/move_folder_to");
                	}else{
                		move_copy("/folder/move_chart_to");
                	}
                }
            },params);
        }else{
        	if(tp == "folder"){
        		move_copy("/folder/move_folder_to");
        	}else{
        		move_copy("/folder/move_chart_to");
        	}
        }
	});
	$("#btn_submit_copy").off().on("click", function(){
		if(!menu.find(".copy-folder-name h2").hasClass("active")){
			Util.globalTopTip("<@i18n resource='user.select_folder'/>", 'top_error', '3000', $("#dlg_copy"), true);
			return;
		}
        if(typeof pageContext.params.teamId != "undefined" || typeof orgId != "undefined"){
            var params = {};
            params.teamId = typeof pageContext.params.teamId != "undefined" ? pageContext.params.teamId : "";
            params.orgId = typeof orgId != "undefined" ? orgId : "";
            Util.checkOrgExpire(function(result){
                if(!result){
                    return false;
                }else{
                	if(tp == "folder"){
                		move_copy("/folder/copy_folder_to");
                	}else{
                		move_copy("/folder/copy_chart_to");
                	}
                    
                }
            },params);
        }else{
        	if(tp == "folder"){
        		move_copy("/folder/copy_folder_to");
        	}else{
        		move_copy("/folder/copy_chart_to");
        	}
        }

	});
	function move_copy(url){
		var folderId = menu.find("h2.active").parent().hasClass("team-folder") || menu.find("h2.active").parent().hasClass("org-folder") ? "": menu.find("h2.active").attr("folderId");
        Util.loading({show:true, content:"<@i18n resource='user.in_operation2'/>"});
        if(tp == "folder"){
        	var moveParams = {fromFolderId: id, toFolderId: folderId, teamId:(typeof menu.find("h2.active").parents(".team-folder").children("h2").attr("folderId") != "undefined" ? menu.find("h2.active").parents(".team-folder").children("h2").attr("folderId") : ""),orgId:(typeof orgId != "undefined" ? orgId : "")}
        }else{
        	var moveParams = {chartId: id, toFolderId: folderId, teamId:(typeof menu.find("h2.active").parents(".team-folder").children("h2").attr("folderId") != "undefined" ? menu.find("h2.active").parents(".team-folder").children("h2").attr("folderId") : ""),orgId:(typeof orgId != "undefined" ? orgId : "")}
        }
		Util.ajax({
			url: "/feishu" + url,
			data: moveParams,
			success: function(data){
                Util.loading("close");
                if(data.result == "success"){
                	pageContext.loadFiles();
					pageContext.loadFileCount();
                }else{
                	Util.globalTopTip(data.msg, 'top_error', '3000', $("#dlg_copy"), true);
                	return
                }
				$("#dlg_copy").dialog("close");
                Util.globalTopTip('<@i18n resource="user.operation_succ"/>', 'top_success', 1500, $("#dlg_copy"), true);
				//清空选中
				$(document).trigger("click.file-op");
			}
		});
	}
	function initFolderList(){
		menu.empty().html('<div class="copy-folder-name org-folder" style="padding-left:0px;"><h2 class="file-rotate" folderId="'+ pageContext.orgId +'"><span class="icons arrow">&#xe61a;</span><span class="icons" style="color:#555">&#xe696;</span><@i18n resource="diagram.title"/>'+((roleLevel == "5") ? "<span class='no-auth' style='float:right;color:#ccc;font-size:12px;'><span class='icons' style='color:#ccc;font-size:13px;margin-top:0;'>&#xe6ad;</span><@i18n resource='user.no_edit_permisson'/></span>":"")+((fId == "root" && !pageContext.params.teamId)?"<span style='float:right;color:#ccc;font-size:12px;'><@i18n resource='user.cur_folder'/></span>":"")+ '</h2><div class="innerFolder"><div></div>');
    	var $teamList = pageContext.team.teamList,$role;
    	for(var i = 0; i < $teamList.length; i++) {
    		$role = pageContext.team.getTeamRole($teamList[i].groupId);
			menu.append('<div class="copy-folder-name team-folder" style="padding-left:0px;"><h2 class="file-rotate" folderId="'+ $teamList[i].groupId +'"><span class="icons arrow">&#xe61a;</span><span class="icons" style="color:#555">&#xeba1;</span>' + $teamList[i].groupName + (($role == "5_reader") ? "<span class='no-auth' style='float:right;color:#ccc;font-size:12px;'><span class='icons' style='color:#ccc;font-size:13px;margin-top:0;'>&#xe6ad;</span><@i18n resource='user.no_edit_permisson'/></span>":"") + ((fId == "root" && pageContext.params.teamId == $teamList[i].groupId)?"<span style='float:right;color:#ccc;font-size:12px;'><@i18n resource='user.cur_folder'/></span>":"") +'</h2><div class="innerFolder"><div></div>');
		}
    	$(".no-auth").parent().find(".icons:not(.arrow)").css("color","#cccccc");
    	$(".no-auth").parent().css("color","#cccccc");
    	$(".copy-content-menu").scrollTop("0")
	}
    function loadFileList(){
        Util.ajax({
            url: "/feishu/folder/getfolderdata",
            success: function(data){  
            	RenderFolderList(data,pageContext.orgId,"root")
            }
        });
    }
    function loadTeamsFileList(id){
        Util.ajax({
            url: "/folder/getTeamfolder",
            data:{teamId:id},
            success: function(data){  
            	RenderFolderList(data,id,"root")
            }
        });
    }
    RenderFolderList(null,"root");
//    初始当前目录所在根目录展开
    if(!pageContext.params.teamId){
    	$("#dlg_copy .copy-folder-name h2[folderId = "+pageContext.orgId+"]").click();
    }else{
    	$("#dlg_copy .copy-folder-name h2[folderId = "+pageContext.params.teamId+"]").click();
    }
    var dirIndex = 0;
    function RenderFolderList(data,$folderId,root){
    	if(data){
    		if(root == "root"){
    			newData = JSON.parse(JSON.stringify(data.folders));
            	delete newData.root;
    			for(var i in newData){
    				nextFolderList[i] = newData[i]
    			}
    			var $folders = data.folders.root;
    		}else{
    			var $folders = nextFolderList[$folderId];
    		}
        	var $rootFolder = menu.find("h2[folderId=" + $folderId + "]").next(".innerFolder");
        	if($folders && $folders.length > 0){
    			for(var i = 0; i < $folders.length; i++) {
            		$rootFolder.append('<div class="copy-folder-name"><h2 class="file-rotate" folderId="'+ $folders[i].folderId +'"><span class="icons arrow">&#xe61a;</span><span class="icons">&#xe633;</span>' + $folders[i].title + (($folders[i].folderId == fId) ? "<span class='curFolder' style='float:right;color:#ccc;font-size:12px;'><@i18n resource='user.cur_folder'/></span>":"") + '</h2><div class="innerFolder"><div></div>');
    			} 
    		}else{
    			menu.find("h2[folderId=" + $folderId + "]").addClass("none")
    		}
        	var $pl = $rootFolder.prev().css('paddingLeft');
    		if($pl) {
    			$pl = $pl.substr(0, $pl.length-2);
    			$rootFolder.find('.copy-folder-name').children("h2").css('paddingLeft', $pl * 1 + 18 + 'px');
    		}
    	}
		$("#dlg_copy .copy-folder-name h2").off("click").on("click", function(e){
			e.stopPropagation();
			var $this = $(this),pId = $this.attr("folderId");
			$("#btn_submit_move,#btn_submit_copy").enable();
			$('.copy-folder-name h2').removeClass('active');
			$this.addClass('active');
			if(pId == fId || pId == id || (fId == "root" && pId == pageContext.params.teamId) || (fId == "root" && pId == orgId && !pageContext.params.teamId)  || $this.parents(".copy-folder-name").children("h2[folderId = "+ id +"]").length > 0){
				$("#btn_submit_move").disable();
			}
			if($this.children(".no-auth").length > 0){
				$("#btn_submit_move,#btn_submit_copy").disable();
				return
            }
            
            if( location.pathname.indexOf("/team/") != -1){
                if($this.parents().hasClass("org-folder")){
                    $("#btn_submit_move").disable();
                }
            }
			$this.toggleClass('file-rotate');
			if($this.next('.innerFolder').find('h2').length > 0) {
				$this.next('.innerFolder').toggle(500);
			}else {
				if($this.parent().hasClass("org-folder")){
					loadFileList()
				}else if($this.parent().hasClass("team-folder")){
					loadTeamsFileList($this.attr("folderId"))
				}else{
					RenderFolderList(data,$this.attr("folderId"));
				}
				  
			}
		})
//	    当前目录所属文件夹展开
		var dirList = $(".dir .files-nav-item");
		if(dirIndex < dirList.length){
			dirIndex++;
			$("#dlg_copy .copy-folder-name h2[folderId = "+dirList.eq(dirIndex).data("f-id")+"]").click();
		}
    }
};
//新建按钮组
fileOperation["all"] = [];
fileOperation["all"][7] = {
	nav: "all",
	events: {
		click: function(e){
			e.stopPropagation();
			var obj = e.data.obj;
			var win = $(this).find(".popwin");
			win.toggleClass("active").find(".notifi-list .win-content").empty().data("curPage", 0);
			notification.count();
			win.off("click.popwin").on("click.popwin", function(e){
				e.stopPropagation();
			});
			$(document).off("click.popwin").on("click.popwin", function(e){
				var win = $(this).find(".popwin");
				win.removeClass("active").find(".win-content").empty().data("curPage", 0);
				notification.count();
			});
			if(!win.hasClass('active')){
				return;
			}
			//加载更多 废弃
			// .find(".win-content").off("scroll.popwin").on("scroll.popwin", function(e){
			// 	if($(this).scrollTop() + $(this).height() >= this.scrollHeight && $(this).attr("isloading") == "false"){
			// 		notification.unreadList();
			// 	}
			// });
			this.focus();
			notification.unreadList(function(){
				win.find(".win-content-item").off("click.notifi").on("click.notifi", {obj: obj}, obj.itemClick);
				win.find(".notifi-target .win-header .icons").off("click.notifi").on("click.notifi", {obj: obj}, obj.backList);
			});
		},
		blur: function(e){
			// var win = $(this).find(".popwin");
			// win.removeClass("active").find(".win-content").empty().data("curPage", 0);
			// notification.count();
			// $(this).removeAttr("tabindex");
		}
	},
	itemClick: function(e){
		$(this).parents(".notifi-list")
			.css({
				position:"absolute",
				left:"-100%"
			}).delay(500)
			.hide(0);
		$(this).parents(".notifi-list").siblings('.notifi-target')
			.show(0)
			.css({
				position:"absolute",
				left:0
			});
		Util.ajax({
			url:"/notification/msg",
			data: {notificationId: $(this).attr("detail-id")},
			success: function(data){
				var type = data.notification.type;
				var str;
				if(data.error)
					str = '<span class="error-link">抱歉，展示通知详细信息时发生了错误，一些数据可能被发起者删除了</span>';
				else
					str = '<div>' + NOTIFICATION_TYPE[type].detail.call("simple", data) + '</div>';

				$(".notifi-target .win-content").html(str);
				if(NOTIFICATION_TYPE[type].execute){
					NOTIFICATION_TYPE[type].execute.call($(".notifi-target .win-content"), data);
				}
			}
		});
	},
	backList: function(){
		$(this).parents(".notifi-target")
			.css({
				left:""
			}).delay(500)
			.hide(0);
		$(this).parents(".notifi-target").siblings('.notifi-list')
			.show(0)
			.css({
				left:""
			});
	}
};


//清空
//fileOperation["trash"].push({
//	id: "empty",
//	showState: "all",
//	doc: {
//		name: "<span>",
//		owner: {
//			"class": "file-op-item g-button",
//			html: "<span class='icons'>&#xe62b;</span>清空"
//		},
//		parent: ".file-op"
//	},
//	execute: function(){
//		var param = {fileType:"all", fileId:""};
//		var content = "您将清空回收站，是否继续？<br>此操作不可恢复。";
//		$.confirm({
//			content: content,
//			onConfirm: function(){
//				// Util.loading({show:true, delay:0, content:"in processing"});
//				Util.ajax({
//					url:"/folder/remove_from_trash",
//					data:param,
//					success:function(data){
//						$(".file-list").html("<div class='nofiles'><img src='/assets/images/icon/empty_state_dustbin.svg'/><div>回收站是空的</div></div>");
//						$(document).trigger("mouseup.file-op");
//						// Util.loading("close");
//					}
//				});
//			}
//		});
//	}
//});
////全部还原
//fileOperation["trash"].push({
//	id: "allrestore",
//	showState: "all",
//	doc: {
//		name: "<span>",
//		owner: {
//			"class": "file-op-item g-button",
//			html: "<span class='icons'>&#xe62a;</span>全部还原"
//		},
//		parent: ".file-op"
//	},
//	execute: function(){
//		var param = {fileType:"all", fileId:""};
//		var content = "确认还原所有文件？";
//		$.confirm({
//			content: content,
//			onConfirm: function(){
//				// Util.loading({show:true, delay:0, content:"in processing"});
//				Util.ajax({
//					url:"/folder/restore",
//					data:param,
//					success:function(data){
//						if(data.result == "overed"){
//							Util.globalTopTip("私有存储空间已经不足，只能创建公开文件，您可以 <a target='_blank' href='/support/privatefile'>增加私有文件数量</a>", "top_error", 9000);
//						}else{
//							$(".con-left > a[data-nav='diagrams']").trigger("click");
//						}
//						// Util.loading("close");
//					}
//				});
//			}
//		});
//	}
//});