define([ 'jquery', '../fn/defined', '../fn/cre' ], function( $, defined, cre ){

        var $taskList = $('ul.dropdown-task-list');
        var $taskListContainer = $taskList.parent('li');
        var $taskListLink = $taskList.parent().find(' > a.dropdown-toggle').first();

        function _prependTask( $el ){
            $taskList.find('li.header').after($el);
        }

        function _appendTask( $el ){
            $taskList.append($el);
        }

        function _makeTask( $li ){
            $li.$a = $li.find('> a').first();
            $li.$task = $li.$a.find('> .task');
            $li.$title = $li.$task.find('> span').not('.percent').first();
            $li.$percent = $li.$task.find('> span.percent').first();
            $li.$progress = $li.$a.find('> .progress').first();
            $li.$bar = $li.$progress.find('> .progress-bar').first();
            return $li;
        }

        function isOpen(){
            return $taskListContainer.hasClass('open');
        }

        function showTasks(){
            if( !isOpen() ){
                $taskListContainer.addClass('open');
                $taskListLink.attr('aria-expanded', 'true');
            }
        }

        function hideTasks(){
            if( isOpen() ){
                $taskListContainer.removeClass('open');
                $taskListLink.attr('aria-expanded', 'false');
            }
        }

        function addTask( id, title, percent, href, type, method ){
            if( !defined(href) ){
                href = '#';
            }
            if( !defined(type) ){
                type = 'info';
            }
            if( !defined(method) ){
                method = 'prepend';
            }

            var $li = cre('li').attr('id', 'task_' + id);
            $li.$a = cre('a').attr('href', href);
            $li.$task = cre().addClass('task');
            $li.$title = cre('span').text(title);
            $li.$percent = cre('span').addClass('percent').text(percent + '%');
            $li.$progress = cre().addClass('progress');
            $li.$bar = cre()
                .attr('role', 'progressbar')
                .attr('aria-valuenow', percent)
                .attr('aria-valuemin', 0)
                .attr('aria-valuemax', 100)
                .css('width', percent + '%')
                .addClass('progress-bar progress-bar-' + type);

            if( method === 'prepend' ){
                _prependTask($li);
            } else {
                _appendTask($li);
            }

            return $li.append(
                $li.$a.append(
                    $li.$task.append($li.$title, $li.$percent),
                    $li.$progress.append($li.$bar)
                )
            );
        }

        function getTask( id ){
            return _makeTask($taskList.find('#task_' + id));
        }

        function _makeEl( $el ){
            if( typeof $el === 'string' ){
                $el = getTask($el);
            } else if( !defined($el.$a) ){
                $el = _makeTask($el);
            }
            return $el;
        }

        function setProgress( $el, percent ){
            $el = _makeEl($el);
            $el.$percent.text(percent + '%');
            $el.$bar.attr('aria-valuenow', percent).css('width', percent + '%');
            return $el;
        }

        function setTitle( $el, title ){
            $el = _makeEl($el);
            $el.$title.text(title);
            return $el;
        }

        function setType( $el, type ){
            $el = _makeEl($el);
            $el.$bar.removeAttr('class').addClass('progress-bar progress-bar-' + type);
            return $el;
        }

    return {
        add        : addTask,
        show       : showTasks,
        hide       : hideTasks,
        isOpen     : isOpen,
        setProgress: setProgress,
        setType    : setType,
        setTitle   : setTitle,
        get        : getTask
    };
});
