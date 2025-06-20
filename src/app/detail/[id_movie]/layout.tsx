import Header from '@/components/organisms/Header'

export default function DetailLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <>
            <Header />
            {children}
        </>
    )
}