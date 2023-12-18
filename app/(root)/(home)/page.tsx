import Filter from "@/components/shared/filter/Filter";
import HomeFilters from "@/components/home/HomeFilters";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import NoResult from "@/components/shared/noResult/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQL Alchemy?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sqlalchemy" },
    ],
    author: {
      _id: "author1",
      name: "John Doe",
      avatar: "link_to_avatar_image",
    },
    upvotes: 1100000,
    views: 100,
    answers: [
      // ... array of answer objects
    ],
    createdAt: new Date("2021-09-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to center a div in CSS?",
    tags: [
      { _id: "3", name: "css" },
      { _id: "4", name: "html" },
    ],
    author: {
      _id: "author2",
      name: "Jane Doe",
      avatar: "link_to_another_avatar_image",
    },
    upvotes: 15,
    views: 150,
    answers: [
      // ... array of answer objects
    ],
    createdAt: new Date("2021-09-02T14:00:00.000Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There are no questions to show"
            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            urlPath="/ask-question"
            LinkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
