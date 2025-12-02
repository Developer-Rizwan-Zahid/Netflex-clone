import Image from "next/image";
import Link from "next/link";

async function getMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 60 } } 
  );
  const data = await res.json();
  return data.results || [];
}

export default async function Home() {
  const movies = await getMovies();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans">
      {/* Hero Section */}
      <main
        className="flex flex-col items-center justify-center flex-1 px-8 text-center bg-cover bg-center bg-no-repeat h-[90vh]"
        style={{
          backgroundImage:
            "url('https://res09.bignox.com/appcenter/en/2020/02/US-en-20200210-popsignuptwoweeks-perspective_alpha_website_large.jpg')",
        }}
      >
        <div className="bg-black/50 p-6 rounded-lg">
          <h1 className="text-5xl font-bold mb-6">
            Unlimited Movies, TV Shows, and More
          </h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl">
            Watch anywhere. Cancel anytime. Explore our collection.
          </p>

          <Link
            href="/signup"
            className="px-6 py-3 bg-red-600 mb-4 text-white rounded text-lg hover:bg-red-700 transition"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Featured Section */}
      <section className="px-8 py-16 bg-gray-900">
        <h2 className="text-3xl font-bold mb-6">Popular Movies</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies.map((movie: any) => (
            <div
              key={movie.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg"
            >
              <div className="w-full h-72 relative">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-center text-sm font-bold">
                {movie.title}
              </div>
            </div>
          ))}
        </div>
      </section>
       {/* Footer */}
      <footer className="px-8 py-8 text-gray-400 text-center text-sm">
        Netflix Clone © {new Date().getFullYear()}. All rights reserved.
      </footer>
    </div>
  );
}
