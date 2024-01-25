import GetGoalResponseDTO from "./GetGoalResponseDTO";

export default interface GetKeptGoalsResponseDTO {
    goals: GetGoalResponseDTO[];
    goalCount: number;
}