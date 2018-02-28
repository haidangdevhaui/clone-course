var form = '<form class="flat-contact-form" id="contactform" method="post" action="./contact/contact-process.php">';
form += '<div style="max-width:669px;display:none;" class="btn-close"><span style="float:right;background: #ffaa30;border-radius: 10px;color: white;" title="close form">&nbsp;<i class="fa fa-close"></i>&nbsp;</span></div>';
form += '<input type="hidden" name="parent" class="comment-parent" value="0">';
form += config.token;
form += '<input type="hidden" name="course_id" value="' + config.course_id + '">';
form += '<textarea class="type-input" tabindex="3" placeholder="Comment*" name="message" id="message-contact1" style="height: 100px; resize: none;" required="" minlength="3" maxlength=""></textarea>';
form += '<button class="flat-button bg-orange">Bình luận</button>';
form += '</form>';

var comment = '<li>';
comment += '<article class="comment ${class}">';
comment += '<div class="comment-avatar" >';
comment += '<img src="${image}" alt="${name}" style="border: 1px solid #dddd;border-radius: 80px;" width="80" height="80">';
comment += '</div>';
comment += '<div class="comment-detail">';
comment += '<div class="comment-meta">';
comment += '<p class="comment-author"><a href="javascript:;">${name}</a></p>';
comment += '<p class="comment-date"><a href="">${date}</a></p>';
comment += '</div>';
comment += '<p class="comment-body">${message}</p>'
comment += '<a href="javascript:;" class="comment-reply" data-id="${parent}">Reply</a>';
comment += '</div><!-- /.comment-detail -->';
comment += '</article><!-- /.comment -->';
comment += '</li>';


function getComment() {
    $.ajax({
        url: config.base_url + 'api/comment/',
        method: 'POST',
        data: { course_id: config.course_id, csrf_expel_dog: config.tokenval },
        success: function(data) {
            if (typeof data == 'object') {
                var dataComment = '';
                data.forEach(function(element) {
                    if (element.parent == 0) {
                        dataComment += comment.replace('${image}', config.base_url + element.image).replace('${name}', element.name).replace('${name}', element.name).replace('${message}', element.content).replace('${date}', element.created_at).replace('${parent}', element.id).replace('${class}', '');
                        data.forEach(function(ele, index) {
                            if (element.id == ele.parent) {
                                dataComment += ele.replace('${image}', config.base_url + ele.image).replace('${name}', ele.name).replace('${name}', ele.name).replace('${message}', ele.content).replace('${date}', ele.created_at).replace('${parent}', element.id).replace('${class}', 'style1');
                                delete data[index];
                            }
                        });
                    }
                });
                if (dataComment === '') {
                    dataComment = '<h3 class="text-center text-yellow">Khóa học chưa có bình luận nào, hãy là người đầu tiên góp ý!</h3>';
                }
                $('.comment-list').html(dataComment);
                addReplyaction();
            } else {
                $('.comment-list').html('<h3 class="text-center">Khóa học chưa có bình luận nào, hãy là người đầu tiên góp ý!</h3>');
            }
        }
    });
}

function showBtnClose() {
    $('.btn-close').show();
    closeForm();

}

function closeForm() {
    $('.btn-close').click(function() {
        $('.comment-reply').show();
        $(this).parent().remove();
        showFormOrigin();
    });

}

function addReplyaction() {
    $('.comment-reply').click(function(e) {
        $(this).after(form);
        $('.comment-parent').val($(this).attr('data-id'));
        showBtnClose();
        submitFrom();
        $(this).hide();

        removeFormOrigin();
        return false;
    })
}

function submitFrom() {
    $('#contactform').submit(function(e) {
        $.ajax({
            url: config.base_url + 'api/comment/add',
            method: 'POST',
            data: $(this).serialize(),
            success: function(data) {
                if (data == 401) {
                    if (confirm('Phải đăng nhập mới bình luận được, bạn muốn đăng nhập chứ?')) {
                        window.location.href = config.base_url + 'login';
                    }
                } else if (data != 200) {
                    if (confirm('Có lỗi xảy ra, bạn có muốn reload lại trang!')) {
                        window.location.reload();
                    }
                }
                showFormOrigin();
                getComment();
            }
        });

        e.preventDefault();
    })
}

function showFormOrigin() {
    $('.form-origin').html(form);
    $('.form-origin .comment-parent').val('0');

    submitFrom();
}


function removeFormOrigin() {
    $('.form-origin form').remove();
}


getComment();
showFormOrigin();
addReplyaction();