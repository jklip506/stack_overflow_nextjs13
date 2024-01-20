import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import NoResult from "@/components/shared/noResult/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestionByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import { IQuestion } from "@/models/question.model";

export default async function Home({ params, searchParams }: URLProps) {
  const tagId = params.id;
  const result = await getQuestionByTagId({
    tagId,
    page: 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          {result?.question.name}
        </h1>
      </div>

      <div className="mt-11 w-full">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result?.question.questions.length > 0 ? (
          result?.question.questions.map((question: IQuestion) => (
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
