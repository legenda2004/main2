// Навигация и функциональность
class App {
    constructor() {
        this.currentPage = 'hot-tours';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTourvisor();
        this.setupServiceWorker();
        this.setupAnimations();
        this.setupModal();
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

                // Добавляем анимацию клика
                this.animateClick(item);
            });
        });
    }

    animateClick(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
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

            // Инициализируем модули Tourvisor при переходе
            this.initializeTourvisorModules();

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
        // Ждем загрузки скрипта Tourvisor
        this.waitForTourvisor().then(() => {
            this.initializeTourvisorModules();
        }).catch(error => {
            console.log('Tourvisor loading failed:', error);
            this.showTourvisorError();
        });
    }

    waitForTourvisor() {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                if (typeof window.Tourvisor !== 'undefined') {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Таймаут 10 секунд
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Tourvisor loading timeout'));
            }, 10000);
        });
    }

    initializeTourvisorModules() {
        if (typeof window.Tourvisor === 'undefined') {
            console.log('Tourvisor not loaded yet');
            return;
        }

        // Инициализируем модули на активной странице
        switch(this.currentPage) {
            case 'hot-tours':
                this.initializeHotTours();
                break;
            case 'search':
                this.initializeSearch();
                break;
        }
    }

    initializeHotTours() {
        const module = document.getElementById('hot-tours-module');
        const loader = document.getElementById('hot-tours-loader');

        if (module && loader) {
            // Показываем loader
            loader.style.display = 'block';

            // Инициализируем модуль
            if (window.Tourvisor.Modules) {
                window.Tourvisor.Modules.init();
            }

            // Скрываем loader через время (на всякий случай)
            setTimeout(() => {
                loader.style.display = 'none';
            }, 3000);
        }
    }

    initializeSearch() {
        const module = document.getElementById('search-module');
        const loader = document.getElementById('search-loader');

        if (module && loader) {
            loader.style.display = 'block';

            if (window.Tourvisor.Modules) {
                window.Tourvisor.Modules.init();
            }

            setTimeout(() => {
                loader.style.display = 'none';
            }, 3000);
        }
    }

    showTourvisorError() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'tourvisor-error';
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-light);">
                <div style="font-size: 3rem; margin-bottom: 20px;">😔</div>
                <h3>Не удалось загрузить данные</h3>
                <p>Пожалуйста, проверьте подключение к интернету и обновите страницу</p>
                <button onclick="location.reload()" class="btn-primary" style="margin-top: 20px;">
                    Обновить страницу
                </button>
            </div>
        `;

        const containers = document.querySelectorAll('.module-container');
        containers.forEach(container => {
            const existingError = container.querySelector('.tourvisor-error');
            if (!existingError) {
                container.appendChild(errorDiv.cloneNode(true));
            }
        });
    }

    setupAnimations() {
        // Анимация появления элементов при скролле
        this.setupScrollAnimations();

        // Анимация фона
        this.setupBackgroundAnimations();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Наблюдаем за карточками и другими элементами
        document.querySelectorAll('.offer-card, .profile-card, .module-container').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupBackgroundAnimations() {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 2}s`;
        });
    }

    setupModal() {
        // Закрытие модального окна по клику вне его
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('vipModal');
            if (e.target === modal) {
                this.closeVIPModal();
            }
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeVIPModal();
            }
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
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

function showVIPModal() {
    const modal = document.getElementById('vipModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVIPModal() {
    const modal = document.getElementById('vipModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showAuthOptions() {
    alert('Доступны следующие способы входа:\n\n• По номеру телефона\n• Через социальные сети\n• По электронной почте\n\nВыберите удобный способ в личном кабинете.');
}

// Обработка онлайн/офлайн статуса
window.addEventListener('online', () => {
    showNotification('✅ Соединение восстановлено', 'success');
    // Перезагружаем модули Tourvisor
    if (window.app) {
        window.app.initializeTourvisorModules();
    }
});

window.addEventListener('offline', () => {
    showNotification('❌ Отсутствует интернет-соединение', 'error');
});

// Утилиты
function showNotification(message, type = 'info') {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: 'var(--border-radius-sm)',
        color: 'var(--text-white)',
        fontWeight: 'bold',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)'
    };

    if (type === 'success') {
        styles.background = 'linear-gradient(135deg, var(--primary-green), var(--secondary-green))';
    } else if (type === 'error') {
        styles.background = 'linear-gradient(135deg, var(--primary-red), var(--secondary-red))';
    } else {
        styles.background = 'rgba(255,255,255,0.2)';
    }

    Object.assign(notification.style, styles);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
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