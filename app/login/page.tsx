import Button from '@/components/ui/Button'

export default function Login() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="heading-hero mb-6 text-3xl animate-fade-in">
              Welcome back
            </h1>
            <p className="text-body-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Welcome to your premium video streaming platform. Experience content like never before.
            </p>
            <form className='m-10'>
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Password" />
            </form>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg" className="rounded-none">
                login
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

