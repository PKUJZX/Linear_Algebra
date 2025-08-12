document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content');
    const navLinks = document.querySelectorAll('.nav-link');

    // 定义一个函数来加载并显示章节内容
    const loadContent = async (pageName) => {
        // 在加载新内容前，先显示一个提示
        contentArea.innerHTML = '<p>正在加载内容，请稍候...</p>';
        
        // 更新活动链接的样式
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        try {
            // 使用 fetch API 异步获取 HTML 文件内容
            const response = await fetch(`chapters/${pageName}.html`);

            // 检查请求是否成功
            if (!response.ok) {
                throw new Error(`无法加载页面: ${response.status} ${response.statusText}`);
            }

            // 获取响应的文本内容
            const htmlContent = await response.text();
            
            // 将获取到的 HTML 内容注入到主内容区域
            contentArea.innerHTML = htmlContent;

            // **关键步骤**: 内容加载后，需要告诉 MathJax 重新扫描并渲染页面上的数学公式
            // 如果不执行此步，新加载的公式将不会被渲染
            if (window.MathJax) {
                // MathJax.typesetPromise() 是更现代、更推荐的方法
                MathJax.typesetPromise([contentArea]).catch((err) => console.log('MathJax typeset failed: ', err));
            }

        } catch (error) {
            // 如果加载失败，显示错误信息
            contentArea.innerHTML = `<p style="color: red;">抱歉，加载内容时发生错误。请检查文件路径是否正确，或查看控制台获取更多信息。</p>`;
            console.error('加载内容失败:', error);
        }
    };

    // 为每个导航链接添加点击事件监听器
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // 阻止链接的默认跳转行为
            const page = link.getAttribute('data-page');
            if (page) {
                loadContent(page);
            }
        });
    });

    // 页面首次加载时，默认加载第一部分的内容
    loadContent('ch1');
});
