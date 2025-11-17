// Навигация
class App {
    constructor() {
        this.currentPage = 'hot-tours';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTourvisor();
        this.setupServiceWorker();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetPage = item.getAttribute('data-page');
                this.switchPage(targetPage);

                // Обновляем активное состояние
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    switchPage(pageId) {
        // Скрываем все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Показываем выбранную страницу
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;

            // Обновляем заголовок
            this.updatePageTitle(targetPage);

            // Прокрутка вверх
            window.scrollTo(0, 0);
        }
    }

    updatePageTitle(page) {
        const titleElement = page.querySelector('h1');
        if (titleElement) {
            document.title = `${titleElement.textContent} - Жгучие туры`;
        }
    }

    setupTourvisor() {
        // Tourvisor автоматически инициализируется через их скрипт
        // Добавляем обработчики для улучшения UX
        this.enhanceTourvisorModules();
    }

    enhanceTourvisorModules() {
        // Добавляем индикатор загрузки для модулей Tourvisor
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList) {
                            if (node.classList.contains('tv-module')) {
                                this.addLoadingState(node);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addLoadingState(module) {
        const loader = document.createElement('div');
        loader.className = 'module-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <p>Загрузка данных...</p>
        `;

        module.style.position = 'relative';
        module.appendChild(loader);

        // Убираем loader через некоторое время (Tourvisor сам управляет контентом)
        setTimeout(() => {
            if (loader.parentNode) {
                loader.remove();
            }
        }, 3000);
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Регистрируем Service Worker для PWA
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// Глобальные функции
function openLink(url) {
    window.open(url, '_blank');
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// PWA функциональность
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Обработка онлайн/офлайн статуса
window.addEventListener('online', () => {
    this.showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', () => {
    this.showNotification('Отсутствует интернет-соединение', 'error');
});

// Утилиты
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, var(--primary-green), var(--secondary-green))';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, var(--primary-red), var(--secondary-red))';
    } else {
        notification.style.background = 'var(--text-light)';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}