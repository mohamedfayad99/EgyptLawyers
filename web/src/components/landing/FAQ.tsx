import { useState } from 'react';
import {
    Box, Container, Stack, Typography,
    Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLang } from '../../contexts/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const faqs = [
    {
        en: {
            q: 'Who can join the Egyptian Lawyers Network?',
            a: 'The platform is exclusively for licensed Egyptian lawyers who hold a valid Egyptian Bar Association (Syndicate) Card. Clients and non-lawyers cannot register.',
        },
        ar: {
            q: 'من يمكنه الانضمام إلى شبكة المحامين المصريين؟',
            a: 'المنصة حصرية للمحامين المصريين المرخصين الذين يحملون بطاقة نقابة محامين سارية المفعول. لا يمكن للعملاء أو غير المحامين التسجيل.',
        },
    },
    {
        en: {
            q: 'How does the Syndicate Card verification work?',
            a: 'After creating your profile, you upload a clear photo of your Egyptian Bar Association Syndicate Card. Our team manually reviews and verifies your credentials within 24 hours. You\'ll receive a notification once approved.',
        },
        ar: {
            q: 'كيف يعمل التحقق من بطاقة النقابة؟',
            a: 'بعد إنشاء ملفك الشخصي، تقوم برفع صورة واضحة من بطاقة نقابة المحامين المصريين. يقوم فريقنا بمراجعة بياناتك يدوياً والتحقق منها خلال 24 ساعة. ستتلقى إشعاراً عند الموافقة.',
        },
    },
    {
        en: {
            q: 'Is the platform free to use?',
            a: 'Yes, downloading the app and creating a profile is completely free. Our mission is to empower Egyptian lawyers through a professional network without financial barriers to entry.',
        },
        ar: {
            q: 'هل المنصة مجانية الاستخدام؟',
            a: 'نعم، تحميل التطبيق وإنشاء الملف الشخصي مجاني تماماً. مهمتنا هي تمكين المحامين المصريين من خلال شبكة مهنية دون حواجز مالية.',
        },
    },
    {
        en: {
            q: 'How is my personal data protected?',
            a: 'Your data is encrypted and stored securely. We never share your personal information with third parties. Your WhatsApp number is only visible to lawyers who respond to your posted requests — not publicly.',
        },
        ar: {
            q: 'كيف تتم حماية بياناتي الشخصية؟',
            a: 'بياناتك مشفرة ومحفوظة بأمان. لن نشارك معلوماتك الشخصية مع أطراف ثالثة أبداً. رقم واتساب الخاص بك مرئي فقط للمحامين الذين يستجيبون لطلباتك المنشورة — وليس للعامة.',
        },
    },
    {
        en: {
            q: 'Can I use the platform across multiple cities and courts?',
            a: 'Absolutely. You can list all the courts and cities you are available to cover in your profile. When requests are posted matching your listed courts and cities, you\'ll receive push notifications instantly.',
        },
        ar: {
            q: 'هل يمكنني استخدام المنصة عبر مدن ومحاكم متعددة؟',
            a: 'بالطبع. يمكنك إدراج جميع المحاكم والمدن التي تتوفر لتغطيتها في ملفك الشخصي. عند نشر طلبات تطابق محاكمك ومدنك المدرجة، ستتلقى إشعارات فورية.',
        },
    },
    {
        en: {
            q: 'What if I have a dispute with another lawyer on the platform?',
            a: 'We have a dedicated support team to handle disputes. Any lawyer found violating professional ethics or platform rules will have their account reviewed and may be suspended.',
        },
        ar: {
            q: 'ماذا لو كان لدي نزاع مع محامٍ آخر على المنصة؟',
            a: 'لدينا فريق دعم متخصص للتعامل مع النزاعات. أي محامٍ يُثبت انتهاكه للأخلاقيات المهنية أو قواعد المنصة سيخضع حسابه للمراجعة وقد يتعرض للتعليق.',
        },
    },
];

export default function FAQ() {
    const { t } = useLang();
    const { ref, visible } = useScrollAnimation();
    const [expanded, setExpanded] = useState<number | false>(false);

    const handleChange = (panel: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box
            id="faq"
            sx={{
                py: { xs: 10, md: 14 },
                bgcolor: 'var(--color-surface)',
            }}
        >
            <Container maxWidth="md">
                {/* Header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 7 }}>
                    <Typography
                        sx={{
                            color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.8rem',
                            textTransform: 'uppercase', letterSpacing: 2,
                        }}
                    >
                        {t('Common Questions', 'الأسئلة الشائعة')}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-text)', textAlign: 'center' }}>
                        {t('Frequently Asked Questions', 'الأسئلة المتكررة')}
                    </Typography>
                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.65)', textAlign: 'center', maxWidth: 500, lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {t(
                            'Everything you need to know before joining the network.',
                            'كل ما تحتاج لمعرفته قبل الانضمام إلى الشبكة.',
                        )}
                    </Typography>
                </Stack>

                {/* Accordion */}
                <Stack
                    ref={ref}
                    spacing={1.5}
                    sx={{
                        transition: 'all 0.6s ease',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(24px)',
                    }}
                >
                    {faqs.map((faq, i) => (
                        <Accordion
                            key={i}
                            expanded={expanded === i}
                            onChange={handleChange(i)}
                            disableGutters
                            elevation={0}
                            sx={{
                                border: '1px solid',
                                borderColor: expanded === i
                                    ? 'rgba(var(--color-primary-rgb),0.4)'
                                    : 'rgba(var(--color-text-rgb),0.08)',
                                borderRadius: '12px !important',
                                bgcolor: expanded === i
                                    ? 'rgba(var(--color-primary-rgb),0.03)'
                                    : 'var(--color-background)',
                                transition: 'all 0.3s ease',
                                '&:before': { display: 'none' },
                                '&:hover': {
                                    borderColor: 'rgba(var(--color-primary-rgb),0.3)',
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon
                                        sx={{
                                            color: expanded === i ? 'var(--color-primary)' : 'rgba(var(--color-text-rgb),0.5)',
                                            transition: 'color 0.3s',
                                        }}
                                    />
                                }
                                sx={{ px: 3, py: 0.5 }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: expanded === i ? 'var(--color-primary)' : 'var(--color-text)',
                                        fontSize: '0.95rem',
                                        transition: 'color 0.3s',
                                    }}
                                >
                                    {t(faq.en.q, faq.ar.q)}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                <Typography
                                    sx={{
                                        color: 'rgba(var(--color-text-rgb),0.72)',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.8,
                                    }}
                                >
                                    {t(faq.en.a, faq.ar.a)}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
}
