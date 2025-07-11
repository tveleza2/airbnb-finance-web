import { defineComponent, ref, onMounted } from 'vue';
import { api } from '../services/api';
export default defineComponent({
    name: 'HomeView',
    setup() {
        const metrics = ref([
            { title: 'Total Income', value: '$0.00' },
            { title: 'Total Expenses', value: '$0.00' },
            { title: 'Net Profit', value: '$0.00' },
            { title: 'Monthly Balance', value: '0' }
        ]);
        const error = ref('');
        onMounted(async () => {
            try {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth()).padStart(2, '0'); // getMonth() is zero-based
                const monthly = await api.getMonthlyStats();
                const monthlyBalance = await monthly["monthly-balance"][`${year}-${month}`];
                console.log(`${year}-${month}`);
                metrics.value[0].value = `$${(monthly["total-income"]).toFixed(2)}`;
                metrics.value[1].value = `$${monthly["total-expenses"].toFixed(2)}`;
                metrics.value[2].value = `$${monthly["net-profit"].toFixed(2)}`;
                metrics.value[3].value = '$' + (monthlyBalance >= 0 ? '+' : '') + monthlyBalance;
            }
            catch (err) {
                error.value = err.message || 'Failed to load dashboard metrics';
            }
        });
        return {
            metrics,
            error
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container mx-auto p-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" },
});
for (const [metric, index] of __VLS_getVForSourceType((__VLS_ctx.metrics))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white rounded-lg shadow p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-xl font-semibold text-center mb-2" },
    });
    (metric.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-center text-3xl" },
    });
    (metric.value);
}
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
var __VLS_dollars;
let __VLS_self;
