namespace Teste.Application.BackgroundServices;

// Essa classe é necessária pela diferença de escopo entre o background service e o HttpClient
public class ReprocessOrdersQueueHttpClient(HttpClient httpClient)
{
    public HttpClient HttpClient { get; set; } = httpClient;
}
