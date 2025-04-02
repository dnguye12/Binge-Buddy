"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

interface SetOptionsProp {
    conversationId: string,
    voteSessionId: string
}
type OptionStep = "platforms" | "genres"
type PlatformKey = "Netflix" | "PrimeVideo" | "DisneyPlus" | "CanalPlus" | "Youtube" | "Twitch";

const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]


const SetOptions = ({ conversationId, voteSessionId }: SetOptionsProp) => {
    const [step, setStep] = useState<OptionStep>("platforms")
    const [stepCount, setStepCount] = useState(1)
    const [platforms, setPlatforms] = useState<Record<PlatformKey, boolean>>({
        "Netflix": false,
        "PrimeVideo": false,
        "DisneyPlus": false,
        "CanalPlus": false,
        "Youtube": false,
        "Twitch": false,
    })
    const [selectedGenres, setSelectedGenres] = useState<Record<number, boolean>>(
        genres.reduce((acc, _, index) => {
            acc[index] = false;
            return acc
        }, {} as Record<number, boolean>)
    )

    const chosenPlatforms = Object.values(platforms).some(isSelected => isSelected === true)
    const chosenGenres = Object.values(selectedGenres).some(isSelected => isSelected === true)

    const togglePlatform = (platform: PlatformKey) => {
        setPlatforms((prev) => ({
            ...prev,
            [platform]: !prev[platform]
        }))
    }

    const selectAllPlatforms = () => {
        const helper = Object.fromEntries(
            Object.keys(platforms).map(p => [p, true])
        ) as Record<PlatformKey, boolean>

        setPlatforms(helper)
    }

    const deselectAllPlatforms = () => {
        const helper = Object.fromEntries(
            Object.keys(platforms).map(p => [p, false])
        ) as Record<PlatformKey, boolean>

        setPlatforms(helper)
    }

    const toggleGenre = (genre: string) => {
        const genreKey = Number(genre)
        setSelectedGenres((prev => ({
            ...prev,
            [genreKey]: !prev[genreKey]
        })))
    }

    const selectAllGenres = () => {
        const helper = Object.fromEntries(
            Object.keys(selectedGenres).map(g => [g, true])
        )

        setSelectedGenres(helper)
    }

    const deselectAllGenres = () => {
        const helper = Object.fromEntries(
            Object.keys(selectedGenres).map(g => [g, false])
        )

        setSelectedGenres(helper)
    }

    const handleSubmit = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const helperPlatforms = Object.entries(platforms).filter(([_, isSelected]) => isSelected).map(([platform]) => platform as string)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const helperGenres = Object.entries(selectedGenres).filter(([_, isSelected]) => isSelected).map(([idx]) => genres[parseInt(idx)].id)


        try {
            await axios.patch(`/api/conversation/${conversationId}/voteSession/${voteSessionId}/options`,
                {
                    platforms: helperPlatforms,
                    genres: helperGenres
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex-1 overflow-y-auto relative w-2/3">
            {
                step === "platforms" && (
                    <div className="flex flex-col gap-6 py-6 h-[calc(100vh-73px)]">
                        <h1 className="text-center text-2xl font-semibold my-6">Which platforms would you like?</h1>
                        <div className="flex-1">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 px-6 mb-6">
                                {
                                    (Object.entries(platforms) as [PlatformKey, boolean][]).map(([platform, isSelected]) => (
                                        <Button
                                            key={platform}
                                            onClick={() => togglePlatform(platform)}
                                            variant={isSelected ? "default" : "secondary"}
                                            size={"lg"}
                                            className="shadow-md px-6 py-6 rounded-md cursor-pointer text-lg h-auto"
                                        >
                                            {platform}
                                        </Button>
                                    ))
                                }
                                <Button
                                    onClick={() => deselectAllPlatforms()}
                                    variant={"secondary"}
                                    size={"lg"}
                                    className="shadow-md px-6 py-6 rounded-md cursor-pointer text-lg h-auto"
                                >Deselect all</Button>
                                <Button
                                    onClick={() => selectAllPlatforms()}
                                    variant={"secondary"}
                                    size={"lg"}
                                    className="shadow-md px-6 py-6 rounded-md cursor-pointer text-lg h-auto"
                                >Select all</Button>
                            </div>
                        </div>
                        <div className="flex justify-center items-center gap-6 px-12 w-full">
                            <div className="w-[86px]"></div>
                            <p className="uppercase font-semibold">question {stepCount} of 2</p>
                            <Button
                                onClick={() => { setStep("genres"); setStepCount(2) }}
                                disabled={!chosenPlatforms}
                                size="lg"
                                variant={"default"}
                                className="shadow-md px-6 rounded-md cursor-pointer"
                            >Next <ChevronRight /></Button>
                        </div>
                    </div>
                )
            }
            {
                step === "genres" &&
                (
                    <div className="flex flex-col gap-6 py-6 h-[calc(100vh-73px)]">
                        <h1 className="text-center text-2xl font-semibold">Which genres would you like?</h1>
                        <div className="flex-1 grid grid-cols-3 gap-y-4 gap-x-8 px-6">
                            {
                                (Object.entries(selectedGenres) as [string, boolean][]).map(([g, isSelected]) => (
                                    <Button
                                        key={g}
                                        onClick={() => { toggleGenre(g) }}
                                        variant={isSelected ? "default" : "secondary"}
                                        size={"lg"}
                                        className="shadow-md px-6 py-6 rounded-md cursor-pointer text-lg h-auto"
                                    >
                                        {genres[parseInt(g)].name}
                                    </Button>
                                ))
                            }
                            <Button
                                    onClick={() => deselectAllGenres()}
                                    variant={"secondary"}
                                    size={"lg"}
                                    className="shadow-md px-6 py-6 rounded-md cursor-pointer text-lg h-auto"
                                >Deselect all</Button>
                            <Button
                                onClick={() => selectAllGenres()}
                                variant={"secondary"}
                                size={"lg"}
                                className="shadow-md px-6 py-6 rounded-md cursor-pointer text-lg h-auto"
                            >Select all</Button>
                        </div>
                        <div className="flex justify-center items-center gap-6 px-12 w-full">
                            <Button
                                onClick={() => { setStep("platforms"); setStepCount(1) }}
                                size="lg"
                                variant={"outline"}
                                className="shadow-md px-6 rounded-md cursor-pointer"
                            ><ChevronLeft /> Back</Button>
                            <p className="uppercase font-semibold">question {stepCount} of 2</p>
                            <Button
                                onClick={() => { handleSubmit() }}
                                disabled={!chosenGenres}
                                size="lg"
                                variant={"default"}
                                className="shadow-md px-6 rounded-md cursor-pointer"
                            >Submit</Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default SetOptions;