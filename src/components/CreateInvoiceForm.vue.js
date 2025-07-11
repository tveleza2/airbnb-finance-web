import { defineComponent, ref, computed, watch } from 'vue';
import { api } from '../services/api';
function toISODate(dateStr) {
    return new Date(dateStr + 'T00:00:00Z').toISOString();
}
export default defineComponent({
    name: 'CreateInvoiceForm',
    emits: ['success', 'error', 'close'],
    props: {
        categories: {
            type: Array,
            required: true
        },
        issuers: {
            type: Array,
            required: true
        },
        invoice: {
            type: Object,
            default: null
        }
    },
    setup(props, { emit }) {
        const form = ref({
            concept: '',
            full_amount: 0,
            vat: 0,
            date: new Date().toISOString().slice(0, 10),
            type: 'expense',
            category_id: undefined,
            issuer_id: undefined,
            invoice_image: undefined
        });
        const loading = ref(false);
        const error = ref('');
        const fileLoading = ref(false);
        const imagePreview = ref(null);
        const isEditingFullAmount = ref(false);
        const isEditingVat = ref(false);
        // Watch for invoice prop to pre-fill form
        watch(() => props.invoice, (newInvoice) => {
            if (newInvoice) {
                form.value = {
                    ...newInvoice,
                    date: newInvoice.date ? newInvoice.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
                };
                imagePreview.value = newInvoice.invoice_image || null;
            }
            else {
                form.value = {
                    concept: '',
                    full_amount: 0,
                    vat: 0,
                    date: new Date().toISOString().slice(0, 10),
                    type: 'expense',
                    category_id: undefined,
                    issuer_id: undefined,
                    invoice_image: undefined
                };
                imagePreview.value = null;
            }
        }, { immediate: true });
        const onFileChange = (e) => {
            const file = e.target.files?.[0];
            if (!file)
                return;
            fileLoading.value = true;
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                if (!result.startsWith('data:image/')) {
                    error.value = 'Invalid image format. Please select a valid image file.';
                    form.value.invoice_image = undefined;
                    imagePreview.value = null;
                    fileLoading.value = false;
                    return;
                }
                form.value.invoice_image = result;
                imagePreview.value = result;
                fileLoading.value = false;
            };
            reader.onerror = () => {
                error.value = 'Failed to read image file.';
                fileLoading.value = false;
            };
            reader.readAsDataURL(file);
        };
        // Currency formatting helpers
        const formatCurrency = (value) => {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'COP' });
        };
        const parseCurrency = (value) => {
            // Remove all non-numeric except dot and minus
            const num = Number(value.replace(/[^\d.-]/g, ''));
            return isNaN(num) ? 0 : num;
        };
        const formattedFullAmount = computed({
            get: () => formatCurrency(Number(form.value.full_amount) || 0),
            set: (val) => {
                form.value.full_amount = parseCurrency(val);
            }
        });
        const formattedVat = computed({
            get: () => formatCurrency(Number(form.value.vat) || 0),
            set: (val) => {
                form.value.vat = parseCurrency(val);
            }
        });
        const isEditMode = computed(() => !!props.invoice && !!props.invoice.id);
        function onFullAmountInput(e) {
            const val = e.target.value;
            form.value.full_amount = parseCurrency(val);
        }
        function onFullAmountBlur() {
            form.value.full_amount = parseCurrency(String(form.value.full_amount));
            isEditingFullAmount.value = false;
        }
        function onVatInput(e) {
            const val = e.target.value;
            form.value.vat = parseCurrency(val);
        }
        function onVatBlur() {
            form.value.vat = parseCurrency(String(form.value.vat));
            isEditingVat.value = false;
        }
        const handleSubmit = async () => {
            if (fileLoading.value) {
                error.value = 'Please wait for the image to finish loading.';
                return;
            }
            loading.value = true;
            error.value = '';
            try {
                const payload = {
                    concept: form.value.concept,
                    full_amount: Number(form.value.full_amount),
                    vat: Number(form.value.vat),
                    date: toISODate(form.value.date),
                    type: form.value.type,
                };
                if (form.value.category_id)
                    payload.category_id = form.value.category_id;
                if (form.value.issuer_id)
                    payload.issuer_id = form.value.issuer_id;
                if (form.value.invoice_image)
                    payload.invoice_image = form.value.invoice_image;
                let result;
                if (isEditMode.value && props.invoice && props.invoice.id) {
                    // Update
                    result = await api.updateInvoice(props.invoice.id, payload);
                }
                else {
                    // Create
                    result = await api.createInvoice(payload);
                }
                emit('success', result);
            }
            catch (e) {
                error.value = e.message || 'Failed to save invoice';
                emit('error', error.value);
            }
            finally {
                loading.value = false;
            }
        };
        function removeImage() {
            form.value.invoice_image = undefined;
            imagePreview.value = null;
        }
        return {
            form,
            handleSubmit,
            loading,
            error,
            onFileChange,
            fileLoading,
            imagePreview,
            formattedFullAmount,
            formattedVat,
            onFullAmountInput,
            onVatInput,
            onFullAmountBlur,
            onVatBlur,
            isEditingFullAmount,
            isEditingVat,
            isEditMode,
            removeImage
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-xl font-semibold mb-4" },
});
(__VLS_ctx.isEditMode ? 'Edit' : 'Create New');
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block text-sm font-medium text-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    value: (__VLS_ctx.form.concept),
    type: "text",
    ...{ class: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" },
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block text-sm font-medium text-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.onFullAmountInput($event);
        } },
    ...{ onFocus: (...[$event]) => {
            __VLS_ctx.isEditingFullAmount = true;
        } },
    ...{ onBlur: (__VLS_ctx.onFullAmountBlur) },
    value: (__VLS_ctx.isEditingFullAmount ? __VLS_ctx.form.full_amount : __VLS_ctx.formattedFullAmount),
    type: "text",
    inputmode: "decimal",
    ...{ class: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" },
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block text-sm font-medium text-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.onVatInput($event);
        } },
    ...{ onFocus: (...[$event]) => {
            __VLS_ctx.isEditingVat = true;
        } },
    ...{ onBlur: (__VLS_ctx.onVatBlur) },
    value: (__VLS_ctx.isEditingVat ? __VLS_ctx.form.vat : __VLS_ctx.formattedVat),
    type: "text",
    inputmode: "decimal",
    ...{ class: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" },
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block text-sm font-medium text-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "date",
    ...{ class: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" },
    required: true,
});
(__VLS_ctx.form.date);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block text-sm font-medium text-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.form.type),
    ...{ class: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" },
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "expense",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "income",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "cost",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block text-sm font-medium text-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.form.category_id),
    ...{ class: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (category.id),
        value: (category.id),
    });
    (category.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block text-sm font-medium text-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.form.issuer_id),
    ...{ class: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [issuer] of __VLS_getVForSourceType((__VLS_ctx.issuers))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (issuer.id),
        value: (issuer.id),
    });
    (issuer.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block text-sm font-medium text-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onChange: (__VLS_ctx.onFileChange) },
    type: "file",
    accept: "image/*",
    ...{ class: "mt-1 block w-full text-sm text-gray-500" },
});
if (__VLS_ctx.imagePreview) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.imagePreview),
        alt: "Preview",
        ...{ class: "max-h-32 rounded border" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.removeImage) },
        type: "button",
        ...{ class: "mt-2 ml-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200" },
    });
}
if (__VLS_ctx.fileLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-xs text-gray-500 mt-1" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-end space-x-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('close');
        } },
    type: "button",
    ...{ class: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700" },
});
(__VLS_ctx.isEditMode ? 'Update' : 'Create');
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-700']} */ ;
var __VLS_dollars;
let __VLS_self;
