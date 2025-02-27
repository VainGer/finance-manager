
export default function Home() {
    return (<>
        <div className="grid grid-cols-2 gap-2 bg-amber-200
         md:bg-red-400 md:*:border-4 *:border-1">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        </div>
    </>)
}