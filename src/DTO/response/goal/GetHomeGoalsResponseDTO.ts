import GetHomeGoalResponseDTO from "./GetHomeGoalResponseDTO";

export default interface GetHomeGoalsResponseDTO {
    goals: GetHomeGoalResponseDTO[];
    goalCount: number;
    cheeringMessage: string;
    daytime: number;
}