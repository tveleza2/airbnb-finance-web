// ...existing code from ExpensesView.vue, but as InvoicesView.vue...
// This file is now the main invoices view, using Invoice types and CreateInvoiceForm.
// ...existing code...
import { defineComponent, ref, onMounted } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import CreateInvoiceForm from '../components/CreateInvoiceForm.vue';
import CreateIssuerForm from '../components/CreateIssuerForm.vue';
import CreateCategoryForm from '../components/CreateCategoryForm.vue';
import { api } from '../services/api';
export default defineComponent({
    name: 'InvoicesView',
    components: {
        Dialog,
        DialogPanel,
        TransitionChild,
        TransitionRoot,
        CreateInvoiceForm,
        CreateIssuerForm,
        CreateCategoryForm
    },
    setup() {
        const invoices = ref([]);
        const categories = ref([]);
        const issuers = ref([]);
        const showOptions = ref(false);
        const isModalOpen = ref(false);
        const activeModal = ref(null);
        const error = ref('');
        const success = ref('');
        const showImageModal = ref(false);
        const selectedInvoice = ref(null);
        const editInvoice = ref(null);
        onMounted(() => {
            loadData();
        });
        const loadData = async () => {
            try {
                invoices.value = await api.getInvoices();
                categories.value = await api.getCategories();
                issuers.value = await api.getIssuers();
            }
            catch (err) {
                error.value = err.message || 'Failed to load data';
            }
        };
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString();
        };
        const getCategoryName = (categoryId) => {
            if (!categoryId)
                return 'Uncategorized';
            const category = categories.value.find(c => c.id === categoryId);
            return category?.name || 'Uncategorized';
        };
        const openModal = (type) => {
            activeModal.value = type;
            isModalOpen.value = true;
            showOptions.value = false;
            error.value = '';
            success.value = '';
        };
        const closeModal = () => {
            isModalOpen.value = false;
            activeModal.value = null;
        };
        const showInvoiceImage = (invoice) => {
            selectedInvoice.value = invoice;
            showImageModal.value = true;
        };
        const closeImageModal = () => {
            showImageModal.value = false;
            selectedInvoice.value = null;
        };
        const openEditModal = (invoice) => {
            editInvoice.value = { ...invoice };
            activeModal.value = 'invoice';
            isModalOpen.value = true;
            showOptions.value = false;
            error.value = '';
            success.value = '';
        };
        // --- New event-based handlers ---
        const handleInvoiceSuccess = async (created) => {
            success.value = 'Invoice created successfully!';
            await loadData();
            closeModal();
        };
        const handleInvoiceError = (msg) => {
            error.value = msg;
        };
        const handleIssuerSuccess = async (created) => {
            success.value = 'Issuer created successfully!';
            await loadData();
            closeModal();
        };
        const handleIssuerError = (msg) => {
            error.value = msg;
        };
        const handleCategorySuccess = async (created) => {
            success.value = 'Category created successfully!';
            await loadData();
            closeModal();
        };
        const handleCategoryError = (msg) => {
            error.value = msg;
        };
        const fixDropboxUrl = (url) => {
            // Convert Dropbox shared link to direct download link
            return url
                .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
                .replace('/scl/fi/', '/s/')
                .replace(/\?dl=0$/, '')
                .replace(/\?dl=1$/, '')
                .replace(/\?raw=1$/, '');
        };
        // --- Delete invoice handler ---
        const deleteInvoice = async (id) => {
            if (!confirm('Are you sure you want to delete this invoice?'))
                return;
            try {
                await api.deleteInvoice(id);
                success.value = 'Invoice deleted successfully!';
                await loadData();
            }
            catch (err) {
                error.value = err.message || 'Failed to delete invoice';
            }
        };
        return {
            invoices,
            categories,
            issuers,
            showOptions,
            isModalOpen,
            activeModal,
            error,
            success,
            showImageModal,
            selectedInvoice,
            editInvoice,
            formatDate,
            getCategoryName,
            openModal,
            closeModal,
            showInvoiceImage,
            closeImageModal,
            openEditModal,
            handleInvoiceSuccess,
            handleInvoiceError,
            handleIssuerSuccess,
            handleIssuerError,
            handleCategorySuccess,
            handleCategoryError,
            fixDropboxUrl,
            deleteInvoice,
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    CreateInvoiceForm,
    CreateIssuerForm,
    CreateCategoryForm
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container mx-auto p-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 gap-4 mb-16" },
});
if (__VLS_ctx.invoices.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center text-gray-500 py-8" },
    });
}
for (const [invoice] of __VLS_getVForSourceType((__VLS_ctx.invoices))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.showInvoiceImage(invoice);
            } },
        key: (invoice.id),
        ...{ class: "bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-semibold" },
    });
    (invoice.concept);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-600" },
    });
    (invoice.full_amount.toFixed(2));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-600" },
    });
    (invoice.vat.toFixed(2));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-600" },
    });
    (__VLS_ctx.formatDate(invoice.date));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mt-2" },
    });
    (__VLS_ctx.getCategoryName(invoice.category_id));
    if (invoice.invoice_image) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ml-2 text-xs text-blue-500" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center space-x-2" },
    });
    if (typeof invoice.id === 'string' && invoice.id.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(typeof invoice.id === 'string' && invoice.id.length > 0))
                        return;
                    __VLS_ctx.openEditModal(invoice);
                } },
            ...{ class: "text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" },
            title: "Edit Invoice",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            'stroke-width': "1.5",
            stroke: "currentColor",
            ...{ class: "w-6 h-6" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            d: "M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213l-4.182.545.545-4.182 13-13z",
        });
    }
    if (typeof invoice.id === 'string' && invoice.id.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(typeof invoice.id === 'string' && invoice.id.length > 0))
                        return;
                    __VLS_ctx.deleteInvoice(invoice.id);
                } },
            ...{ class: "text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" },
            title: "Delete Invoice",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            'stroke-width': "1.5",
            stroke: "currentColor",
            ...{ class: "w-6 h-6" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            d: "M6 18L18 6M6 6l12 12",
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fixed bottom-6 right-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showOptions = !__VLS_ctx.showOptions;
        } },
    ...{ class: "bg-violet-400 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-violet-600 focus:outline-none" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-2xl leading-none" },
});
if (__VLS_ctx.showOptions) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 w-48" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showOptions))
                    return;
                __VLS_ctx.openModal('invoice');
            } },
        ...{ class: "block w-full text-left px-4 py-2 hover:bg-gray-100 rounded" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showOptions))
                    return;
                __VLS_ctx.openModal('issuer');
            } },
        ...{ class: "block w-full text-left px-4 py-2 hover:bg-gray-100 rounded" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showOptions))
                    return;
                __VLS_ctx.openModal('category');
            } },
        ...{ class: "block w-full text-left px-4 py-2 hover:bg-gray-100 rounded" },
    });
}
const __VLS_0 = {}.TransitionRoot;
/** @type {[typeof __VLS_components.TransitionRoot, typeof __VLS_components.TransitionRoot, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    appear: true,
    show: (__VLS_ctx.isModalOpen),
    as: "template",
}));
const __VLS_2 = __VLS_1({
    appear: true,
    show: (__VLS_ctx.isModalOpen),
    as: "template",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClose': {} },
    as: "div",
    ...{ class: "relative z-10" },
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClose': {} },
    as: "div",
    ...{ class: "relative z-10" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClose: (__VLS_ctx.closeModal)
};
__VLS_7.slots.default;
const __VLS_12 = {}.TransitionChild;
/** @type {[typeof __VLS_components.TransitionChild, typeof __VLS_components.TransitionChild, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    as: "template",
    enter: "duration-300 ease-out",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "duration-200 ease-in",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
}));
const __VLS_14 = __VLS_13({
    as: "template",
    enter: "duration-300 ease-out",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "duration-200 ease-in",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "fixed inset-0 bg-black bg-opacity-25" },
});
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fixed inset-0 overflow-y-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex min-h-full items-center justify-center p-4" },
});
const __VLS_16 = {}.TransitionChild;
/** @type {[typeof __VLS_components.TransitionChild, typeof __VLS_components.TransitionChild, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    as: "template",
    enter: "duration-300 ease-out",
    enterFrom: "opacity-0 scale-95",
    enterTo: "opacity-100 scale-100",
    leave: "duration-200 ease-in",
    leaveFrom: "opacity-100 scale-100",
    leaveTo: "opacity-0 scale-95",
}));
const __VLS_18 = __VLS_17({
    as: "template",
    enter: "duration-300 ease-out",
    enterFrom: "opacity-0 scale-95",
    enterTo: "opacity-100 scale-100",
    leave: "duration-200 ease-in",
    leaveFrom: "opacity-100 scale-100",
    leaveTo: "opacity-0 scale-95",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.DialogPanel;
/** @type {[typeof __VLS_components.DialogPanel, typeof __VLS_components.DialogPanel, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" },
}));
const __VLS_22 = __VLS_21({
    ...{ class: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
if (__VLS_ctx.activeModal === 'invoice') {
    const __VLS_24 = {}.CreateInvoiceForm;
    /** @type {[typeof __VLS_components.CreateInvoiceForm, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onSuccess': {} },
        ...{ 'onError': {} },
        ...{ 'onClose': {} },
        categories: (__VLS_ctx.categories),
        issuers: (__VLS_ctx.issuers),
        invoice: (__VLS_ctx.editInvoice),
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onSuccess': {} },
        ...{ 'onError': {} },
        ...{ 'onClose': {} },
        categories: (__VLS_ctx.categories),
        issuers: (__VLS_ctx.issuers),
        invoice: (__VLS_ctx.editInvoice),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onSuccess: (__VLS_ctx.handleInvoiceSuccess)
    };
    const __VLS_32 = {
        onError: (__VLS_ctx.handleInvoiceError)
    };
    const __VLS_33 = {
        onClose: (__VLS_ctx.closeModal)
    };
    var __VLS_27;
}
if (__VLS_ctx.activeModal === 'issuer') {
    const __VLS_34 = {}.CreateIssuerForm;
    /** @type {[typeof __VLS_components.CreateIssuerForm, ]} */ ;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        ...{ 'onSuccess': {} },
        ...{ 'onError': {} },
        ...{ 'onClose': {} },
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onSuccess': {} },
        ...{ 'onError': {} },
        ...{ 'onClose': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_38;
    let __VLS_39;
    let __VLS_40;
    const __VLS_41 = {
        onSuccess: (__VLS_ctx.handleIssuerSuccess)
    };
    const __VLS_42 = {
        onError: (__VLS_ctx.handleIssuerError)
    };
    const __VLS_43 = {
        onClose: (__VLS_ctx.closeModal)
    };
    var __VLS_37;
}
if (__VLS_ctx.activeModal === 'category') {
    const __VLS_44 = {}.CreateCategoryForm;
    /** @type {[typeof __VLS_components.CreateCategoryForm, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ 'onSuccess': {} },
        ...{ 'onError': {} },
        ...{ 'onClose': {} },
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onSuccess': {} },
        ...{ 'onError': {} },
        ...{ 'onClose': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_48;
    let __VLS_49;
    let __VLS_50;
    const __VLS_51 = {
        onSuccess: (__VLS_ctx.handleCategorySuccess)
    };
    const __VLS_52 = {
        onError: (__VLS_ctx.handleCategoryError)
    };
    const __VLS_53 = {
        onClose: (__VLS_ctx.closeModal)
    };
    var __VLS_47;
}
var __VLS_23;
var __VLS_19;
var __VLS_7;
var __VLS_3;
const __VLS_54 = {}.TransitionRoot;
/** @type {[typeof __VLS_components.TransitionRoot, typeof __VLS_components.TransitionRoot, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    appear: true,
    show: (__VLS_ctx.showImageModal),
    as: "template",
}));
const __VLS_56 = __VLS_55({
    appear: true,
    show: (__VLS_ctx.showImageModal),
    as: "template",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
__VLS_57.slots.default;
const __VLS_58 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    ...{ 'onClose': {} },
    as: "div",
    ...{ class: "relative z-20" },
}));
const __VLS_60 = __VLS_59({
    ...{ 'onClose': {} },
    as: "div",
    ...{ class: "relative z-20" },
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_62;
let __VLS_63;
let __VLS_64;
const __VLS_65 = {
    onClose: (__VLS_ctx.closeImageModal)
};
__VLS_61.slots.default;
const __VLS_66 = {}.TransitionChild;
/** @type {[typeof __VLS_components.TransitionChild, typeof __VLS_components.TransitionChild, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    as: "template",
    enter: "duration-300 ease-out",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "duration-200 ease-in",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
}));
const __VLS_68 = __VLS_67({
    as: "template",
    enter: "duration-300 ease-out",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "duration-200 ease-in",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "fixed inset-0 bg-black bg-opacity-40" },
});
var __VLS_69;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fixed inset-0 overflow-y-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex min-h-full items-center justify-center p-4" },
});
const __VLS_70 = {}.TransitionChild;
/** @type {[typeof __VLS_components.TransitionChild, typeof __VLS_components.TransitionChild, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    as: "template",
    enter: "duration-300 ease-out",
    enterFrom: "opacity-0 scale-95",
    enterTo: "opacity-100 scale-100",
    leave: "duration-200 ease-in",
    leaveFrom: "opacity-100 scale-100",
    leaveTo: "opacity-0 scale-95",
}));
const __VLS_72 = __VLS_71({
    as: "template",
    enter: "duration-300 ease-out",
    enterFrom: "opacity-0 scale-95",
    enterTo: "opacity-100 scale-100",
    leave: "duration-200 ease-in",
    leaveFrom: "opacity-100 scale-100",
    leaveTo: "opacity-0 scale-95",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
const __VLS_74 = {}.DialogPanel;
/** @type {[typeof __VLS_components.DialogPanel, typeof __VLS_components.DialogPanel, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    ...{ class: "w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" },
}));
const __VLS_76 = __VLS_75({
    ...{ class: "w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" },
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-semibold mb-4" },
});
if (__VLS_ctx.selectedInvoice && __VLS_ctx.selectedInvoice.invoice_image) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.fixDropboxUrl(__VLS_ctx.selectedInvoice.invoice_image)),
        alt: "Invoice",
        ...{ class: "max-w-full max-h-[60vh] mx-auto rounded border" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-gray-500" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.closeImageModal) },
    ...{ class: "mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" },
});
var __VLS_77;
var __VLS_73;
var __VLS_61;
var __VLS_57;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-6']} */ ;
/** @type {__VLS_StyleScopedClasses['right-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-violet-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-violet-600']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-16']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-48']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['align-middle']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-40']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['align-middle']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[60vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-700']} */ ;
var __VLS_dollars;
let __VLS_self;
