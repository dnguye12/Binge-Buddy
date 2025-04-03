import { TMDBMovie } from "@/app/types";
import { Button } from "@/components/ui/button";
import { CircleXIcon, InfoIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns";

interface VoteBoxProps {
    idx: number,
    movie: TMDBMovie,
    myVote: boolean,
    voteMovie: (arg0: number) => void,
    superD: number,
    superDislikeMovie: (arg0: number) => void,
    submitted: boolean
}

const VoteBox = ({ idx, movie, myVote, voteMovie, superD, superDislikeMovie, submitted }: VoteBoxProps) => {
    return (
        <div className="relative rounded-md flex items-end gap-x-2">
            <div
                className="absolute w-full h-[calc(100%-56px)] top-0 left-0 z-0 bg-cover bg-center bg-no-repeat rounded-t-md"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})` }}
            ></div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size={"icon"} variant={"secondary"} className="h-12 w-12 shadow-md"><InfoIcon /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Movie description</DialogTitle>
                        <DialogDescription>
                            <p>Title: {movie.title}</p>
                            <p>Overview: {movie.overview}</p>
                            <p>Score: {movie.vote_average.toFixed(2)}/10</p>
                            <p>Total votes: {movie.vote_count}</p>
                            <p>Release date: {format(new Date(movie.release_date), "do MMMM yyyy")}</p>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {
                superD === idx
                    ?
                    (
                        <Button
                            variant={"destructive"}
                            size={"lg"}
                            className="h-12 flex-1 shadow-md"
                            onClick={() => { superDislikeMovie(idx)}}
                            disabled={submitted}
                        ><CircleXIcon /> Cancel the SUPER DISLIKE
                        </Button>
                    )
                    : myVote
                        ?
                        (
                            <Button
                                variant={"destructive"}
                                size={"lg"}
                                className="h-12 flex-1 shadow-md"
                                onClick={() => { voteMovie(idx) }}
                                disabled={submitted}
                            ><CircleXIcon /> Cancel this vote
                            </Button>
                        )
                        :
                        superD === -1
                            ?
                            (
                                <Button
                                    variant={"destructive"}
                                    size={"lg"}
                                    className="h-12 flex-1 shadow-md"
                                    onClick={() => { superDislikeMovie(idx) }}
                                    disabled={submitted}
                                ><ThumbsDownIcon /> Super Dislike this
                                </Button>
                            )
                            :
                            (
                                <Button
                                    size={"lg"}
                                    className="h-12 flex-1 shadow-md"
                                    onClick={() => { voteMovie(idx) }}
                                    disabled={submitted}
                                ><ThumbsUpIcon /> Vote for this
                                </Button>
                            )
            }
        </div >
    );
}

export default VoteBox;