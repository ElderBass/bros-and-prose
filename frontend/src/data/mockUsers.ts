import type { User } from "@/types";

export const mockUsers: User[] = [
    {
        id: "1",
        firstName: "Joel",
        lastName: "Braxton",
        email: "joel.braxton@example.com",
        currentBookProgress: 69420,
        avatar: "robot",
        username: "fuckBoy21",
        role: "user",
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
            eleven_twenty_two_sixty_three_king: {
                id: "dunno-man",
                book: {
                    name: "11/22/63",
                    author: "Stephen King",
                },
                rating: 9,
                reviewComment:
                    "King really outdid himself with this one. The premise sounds gimmicky at first - time travel to stop the JFK assassination - but he pulls it off brilliantly. Jake's journey through the late 50s and early 60s is incredibly immersive, and King's research really shows. The historical details feel authentic without being overwhelming.\n\nWhat impressed me most was how he balanced the massive scope of changing history with intimate character development. The romance with Sadie felt genuine and added real emotional stakes beyond just the historical mission. The way King explores the butterfly effect and the idea that the past pushes back against change was fascinating.\n\nAt 850+ pages it's definitely a commitment, but I found myself completely absorbed. The pacing builds perfectly toward the climactic moment we all know is coming. Even knowing how JFK's story ends, King manages to create real suspense about whether Jake will succeed and what the consequences might be. Easily one of King's best works.",
            },
        },
    },
    {
        id: "2",
        firstName: "Ken",
        lastName: "McGurran",
        email: "ken.mcgurran@example.com",
        currentBookProgress: 70,
        avatar: "dragon",
        username: "kenny_McG",
        role: "user",
        reviews: {
            eleven_twenty_two_sixty_three_king: {
                id: "ken-man",
                book: {
                    name: "11/22/63",
                    author: "Stephen King",
                },
                rating: 8,
                reviewComment:
                    "Upon careful consideration of King's substantial 2011 work, I find '11/22/63' to represent a marked departure from his typical horror paradigm, demonstrating instead a sophisticated exploration of temporal mechanics and historical determinism. The author's meticulous research into the socio-political landscape of the late Eisenhower and early Kennedy administrations provides a robust foundation for the narrative's central conceit.\n\nThe protagonist's methodical approach to altering historical events reflects sound investigative principles, though King wisely illustrates the inherent complexities and unintended consequences of such intervention. The legal and ethical implications of Jake's actions - essentially conspiracy to commit murder, regardless of motive - are handled with appropriate gravity.\n\nFrom a structural standpoint, the novel's pacing is deliberate and well-reasoned, building a compelling evidentiary case for both the mission's necessity and its ultimate futility. The romantic subplot, while potentially superfluous, serves to humanize the protagonist and establish meaningful personal stakes. I would recommend this work without reservation to colleagues seeking substantive literary engagement.",
            },
        },
    },
    {
        id: "3",
        firstName: "Chris",
        lastName: "Dub",
        email: "chris.dub@example.com",
        currentBookProgress: 262,
        avatar: "beer-mug-empty",
        username: "chrisDubStep",
        role: "user",
        reviews: {
            starter_villain_scalzi: {
                id: "nunya-bidness",
                book: {
                    name: "Starter Villain",
                    author: "John Scalzi",
                },
                rating: 8,
                reviewComment:
                    "Yooo this book absolutely SLAPS! King went full send on this time travel concept and it's honestly fire. Like, going back to the 60s to stop JFK from getting capped? That's some next level shit right there bro.\n\nThe way he describes all the old school stuff - the cars, the music, the whole vibe - it's like you're actually there crushing beers with the boys in 1960. And don't even get me started on the romance storyline with Sadie, that shit had me in my feels for real.\n\nNot gonna lie, it's a thick boy of a book (pause) but it's worth the grind. The ending had me shook - won't spoil it but damn, King really knows how to mess with your head. Definitely bumping this one up on my all-time list. If you're looking for something that'll keep you locked in for weeks, this is your book my guy.",
            },
            eleven_twenty_two_sixty_three_king: {
                id: "dunno-man",
                book: {
                    name: "11/22/63",
                    author: "Stephen King",
                },
                rating: 8,
                reviewComment:
                    "King really outdid himself with this one. The premise sounds gimmicky at first - time travel to stop the JFK assassination - but he pulls it off brilliantly. Jake's journey through the late 50s and early 60s is incredibly immersive, and King's research really shows. The historical details feel authentic without being overwhelming.\n\nWhat impressed me most was how he balanced the massive scope of changing history with intimate character development. The romance with Sadie felt genuine and added real emotional stakes beyond just the historical mission. The way King explores the butterfly effect and the idea that the past pushes back against change was fascinating.\n\nAt 850+ pages it's definitely a commitment, but I found myself completely absorbed. The pacing builds perfectly toward the climactic moment we all know is coming. Even knowing how JFK's story ends, King manages to create real suspense about whether Jake will succeed and what the consequences might be. Easily one of King's best works.",
            },
        },
    },
    {
        id: "4",
        firstName: "Judd",
        lastName: "Prasnicky",
        email: "judd.prasnicky@example.com",
        currentBookProgress: 0,
        avatar: "gamepad",
        username: "mo$keeto_byte",
        role: "user",
        reviews: {
            eleven_twenty_two_sixty_three_king: {
                id: "judd-review",
                book: {
                    name: "11/22/63",
                    author: "Stephen King",
                },
                rating: 8,
                reviewComment:
                    "Tight. King strips away the horror gimmicks and delivers pure storytelling. Time travel premise could've been cheesy - instead it's devastating. Every page earns its place. The past doesn't want to be changed, and neither do we after reading this. Essential.",
            },
        },
    },
    {
        id: "5",
        firstName: "Seth",
        lastName: "Zygarlicke",
        email: "zygster11@gmail.com",
        currentBookProgress: 69420,
        avatar: "user-ninja",
        username: "ElderBass",
        role: "admin",
        reviews: {
            starter_villain_scalzi: {
                id: "nunya-bidness",
                book: {
                    name: "Starter Villain",
                    author: "John Scalzi",
                },
                rating: 6,
                reviewComment:
                    "shit rips bro this shit popped off real good I mean damn boy holy crow I ain't read no shit like this since 'Nam when the napalm was scorching the earth and filling my nostrils with an angry inferno so agonizing and sinister I thought my brain my would fucking explode just like Randy when the 'Congs got him with grenades and he just went flying all over the place smearing the jungle like a fucking Warhol and I was all like holy fucking shit why the fuck am I here I'm nineteen years old I ain't ready for shit like this man this is way too heavy",
            },
            eleven_twenty_two_sixty_three_king: {
                id: "seth-jfk-review",
                book: {
                    name: "11/22/63",
                    author: "Stephen King",
                },
                rating: 9,
                reviewComment:
                    "HOLY FUCKING SHIT BALLS this book made me question everything I thought I knew about time and space and the goddamn fabric of reality itself like when Jake goes through that rabbit hole it's like Alice in fucking Wonderland except instead of tea parties it's PREVENTING THE ASSASSINATION OF A PRESIDENT and let me tell you something about Stephen King that magnificent bastard he took me on a journey through the 1960s that was more vivid than my own fucking memories which is saying something because I remember that decade like it was yesterday even though I wasn't born until 1987 but that's beside the point because this book transcends time itself just like Jake does when he steps through that portal and suddenly he's living in a world where everything smells like cigarettes and optimism and the American Dream still meant something before it got shot full of holes like JFK's head in Dealey Plaza but SPOILER ALERT maybe it doesn't have to end that way and that's the beautiful terrifying premise of this masterpiece",
            },
        },
    },
];

export const groupConsensus = {
    eleven_twenty_two_sixty_three_king:
        "The group unanimously praised '11/22/63' as one of King's finest works, with ratings ranging from 8-9/10. Everyone was impressed by King's departure from horror into historical fiction, noting his meticulous research and immersive recreation of the late 1950s and early 1960s. The time travel premise, initially seeming gimmicky, was universally acclaimed for its thoughtful execution and exploration of consequences. The romance subplot with Sadie resonated across the board, adding emotional depth to the historical mission. While the 850+ page length was acknowledged as substantial, all members found themselves completely absorbed. The group particularly appreciated King's handling of the butterfly effect and the concept that 'the past pushes back against change.' Overall consensus: an essential read that transcends genre boundaries and showcases King's versatility as a storyteller.",
};
