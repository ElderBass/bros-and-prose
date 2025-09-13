import type { User } from "@/types";

export const mockUsers: User[] = [
    {
        id: "1",
        firstName: "Joel",
        lastName: "Braxton",
        email: "joel.braxton@example.com",
        currentBookProgress: 69420,
        reviews: {
            starter_villain_scalzi: {
                id: "nunya-bidness",
                book: {
                    name: "Starter Villain",
                    author: "John Scalzi",
                },
                rating: 7,
                reviewComment:
                    "Scalzi delivers another fun romp with his signature wit and humor. The premise of inheriting a supervillain business is absolutely ridiculous in the best way possible, and I found myself chuckling throughout. The dialogue is snappy and the characters are endearing, especially the talking cats (because of course there are talking cats). \n\nThat said, it felt a bit formulaic compared to his earlier work. The plot moves at a breakneck pace but sometimes sacrifices depth for laughs. Still, it's a solid weekend read that doesn't take itself too seriously. If you're looking for something light and entertaining after a heavy book, this hits the spot. Not his best work, but definitely worth the time.",
            },
        },
    },
    {
        id: "2",
        firstName: "Ken",
        lastName: "McGurran",
        email: "ken.mcgurran@example.com",
        currentBookProgress: 70,
        reviews: {},
    },
    {
        id: "3",
        firstName: "Chris",
        lastName: "Dub",
        email: "chris.dub@example.com",
        currentBookProgress: 279,
        reviews: {},
    },
    {
        id: "4",
        firstName: "Judd",
        lastName: "Prasnicky",
        email: "judd.prasnicky@example.com",
        currentBookProgress: 0,
        reviews: {},
    },
    {
        id: "seth_zygarlicke",
        firstName: "Seth",
        lastName: "Zygarlic",
        email: "seth.zygarlic@example.com",
        currentBookProgress: 80,
        reviews: {},
    },
];
