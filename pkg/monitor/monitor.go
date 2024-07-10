package monitor

import (
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
	"time"
)

type Stats struct {
	CPUUsage    float64 `json:"cpu_usage"`
	MemoryUsage uint64  `json:"memory_usage"`
}

func GetStats() (*Stats, error) {
	cpuPercent, err := cpu.Percent(1*time.Second, false)
	if err != nil {
		return nil, err
	}

	virtualMemory, err := mem.VirtualMemory()
	if err != nil {
		return nil, err
	}

	return &Stats{
		CPUUsage:    cpuPercent[0],
		MemoryUsage: virtualMemory.Used,
	}, nil
}

